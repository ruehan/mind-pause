from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from uuid import UUID
from datetime import datetime
import json
import re

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.models.ai_character import AICharacter
from app.models.message import Message
from app.models.conversation_summary import ConversationSummary
from app.models.conversation_metrics import ConversationMetrics
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
)
from app.schemas.message import MessageCreate, MessageResponse
from app.services.llm_service import stream_gemini_response
from app.services.context_service import build_conversation_context, optimize_context_for_token_limit
from app.services.summary_service import check_summary_trigger, create_conversation_summary
from app.services.memory_service import should_update_memory, update_user_memory
from app.services.emotion_service import detect_emotion, format_emotion_summary

router = APIRouter()


# ============================================
# 내부 프로세스 필터링
# ============================================

def filter_internal_process(text: str) -> str:
    """
    AI 응답에서 내부 사고 과정 마커 제거

    CoT(Chain-of-Thought) 프롬프트로 인해 생성될 수 있는
    내부 분석 구조를 사용자에게 보이지 않도록 필터링

    Args:
        text: 필터링할 텍스트

    Returns:
        필터링된 텍스트
    """
    if not text:
        return text

    # 전략 1: **상담사**: 이후의 실제 응답만 추출
    match = re.search(r'\*\*상담사\*\*:\s*(.*)', text, re.DOTALL)
    if match:
        return match.group(1).strip()

    # 전략 2: --- 이후의 실제 응답만 추출
    if '---' in text:
        parts = text.split('---')
        # 마지막 부분이 실제 응답
        return parts[-1].strip()

    # 전략 3: ## 섹션 전체 제거 (섹션이 있지만 구분자가 없는 경우)
    text = re.sub(
        r'##\s*응답 생성 프로세스.*?(?=\n\n[^#\d*])',
        '',
        text,
        flags=re.DOTALL | re.IGNORECASE
    )

    # 전략 4: 번호 리스트 형태의 내부 프로세스 제거 (문장 시작부분만)
    # 하지만 일반 대화 내용은 보존
    lines = text.split('\n')
    filtered_lines = []
    in_process_section = False

    for line in lines:
        # ## 또는 숫자. 로 시작하면 내부 프로세스 섹션 시작
        if re.match(r'^(##|[0-9]+\.)\s', line):
            in_process_section = True
            continue
        # **키워드**: 패턴이면 내부 프로세스
        if re.match(r'^\*\*[^*]+\*\*:\s', line):
            continue
        # 빈 줄이 2개 연속이면 섹션 종료
        if line.strip() == '':
            if in_process_section:
                in_process_section = False
            filtered_lines.append(line)
            continue
        # 내부 프로세스 섹션이 아니면 보존
        if not in_process_section:
            filtered_lines.append(line)

    text = '\n'.join(filtered_lines)

    # 연속된 빈 줄 정리
    text = re.sub(r'\n{3,}', '\n\n', text)

    # 앞뒤 공백 제거
    return text.strip()


# ============================================
# 메트릭 자동 수집
# ============================================

def update_conversation_metrics(
    db: Session,
    conversation_id: UUID,
    user_content: str,
    ai_content: str,
    response_time_ms: float
):
    """
    대화 메트릭 업데이트

    Args:
        db: 데이터베이스 세션
        conversation_id: 대화 ID
        user_content: 사용자 메시지 내용
        ai_content: AI 응답 내용
        response_time_ms: 응답 시간 (밀리초)
    """
    # 기존 메트릭 가져오기 또는 새로 생성
    metrics = db.query(ConversationMetrics).filter(
        ConversationMetrics.conversation_id == conversation_id
    ).first()

    if not metrics:
        metrics = ConversationMetrics(conversation_id=conversation_id)
        db.add(metrics)

    # 토큰 수 추정 (대략 4자 = 1토큰)
    input_tokens = len(user_content) // 4
    output_tokens = len(ai_content) // 4

    # 메시지 수 증가
    metrics.total_messages += 2  # 사용자 + AI
    metrics.user_messages += 1
    metrics.ai_messages += 1

    # 토큰 누적
    metrics.total_input_tokens += input_tokens
    metrics.total_output_tokens += output_tokens

    # 평균 토큰 계산
    metrics.avg_input_tokens = metrics.total_input_tokens / metrics.user_messages
    metrics.avg_output_tokens = metrics.total_output_tokens / metrics.ai_messages

    # 응답 시간 통계 업데이트
    if metrics.avg_response_time_ms is None:
        metrics.avg_response_time_ms = response_time_ms
        metrics.min_response_time_ms = response_time_ms
        metrics.max_response_time_ms = response_time_ms
    else:
        # 평균 업데이트 (누적 평균)
        total_responses = metrics.ai_messages
        metrics.avg_response_time_ms = (
            (metrics.avg_response_time_ms * (total_responses - 1) + response_time_ms) / total_responses
        )
        metrics.min_response_time_ms = min(metrics.min_response_time_ms, response_time_ms)
        metrics.max_response_time_ms = max(metrics.max_response_time_ms, response_time_ms)

    db.commit()


@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation_data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    새 대화 생성

    - **character_id**: 대화할 AI 캐릭터 ID
    - **title**: 선택적 대화 제목 (없으면 첫 메시지에서 자동 생성)
    """
    # AI 캐릭터 존재 및 소유권 확인
    character = db.query(AICharacter).filter(
        AICharacter.id == conversation_data.character_id,
        AICharacter.user_id == current_user.id
    ).first()

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI 캐릭터를 찾을 수 없습니다"
        )

    # 새 대화 생성
    new_conversation = Conversation(
        user_id=current_user.id,
        character_id=conversation_data.character_id,
        title=conversation_data.title
    )

    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return new_conversation


@router.get("", response_model=List[ConversationResponse])
async def list_conversations(
    skip: int = Query(0, ge=0, description="건너뛸 항목 수"),
    limit: int = Query(20, ge=1, le=100, description="가져올 최대 항목 수"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    사용자의 대화 목록 조회 (최신순)

    - **skip**: 페이지네이션을 위한 오프셋
    - **limit**: 한 번에 가져올 대화 수 (최대 100)
    """
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(
        desc(Conversation.updated_at)
    ).offset(skip).limit(limit).all()

    # character는 relationship의 lazy="joined"로 자동 로드됨
    return conversations


@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    특정 대화 조회

    - **conversation_id**: 조회할 대화 ID
    """
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다"
        )

    return conversation


@router.patch("/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: UUID,
    conversation_data: ConversationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    대화 정보 업데이트 (제목 등)

    - **conversation_id**: 업데이트할 대화 ID
    - **title**: 새로운 대화 제목
    """
    print(f"📝 제목 수정 요청: conversation_id={conversation_id}, new_title={conversation_data.title}, user_id={current_user.id}")

    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        print(f"❌ 대화를 찾을 수 없음: conversation_id={conversation_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다"
        )

    # 업데이트
    if conversation_data.title is not None:
        old_title = conversation.title
        conversation.title = conversation_data.title
        print(f"✅ 제목 수정 완료: {old_title} → {conversation_data.title}")

    db.commit()
    db.refresh(conversation)

    return conversation


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    대화 삭제

    - **conversation_id**: 삭제할 대화 ID
    - 대화와 관련된 모든 메시지도 함께 삭제됩니다 (CASCADE)
    """
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다"
        )

    db.delete(conversation)
    db.commit()

    return None


@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: UUID,
    skip: int = Query(0, ge=0, description="건너뛸 메시지 수"),
    limit: int = Query(50, ge=1, le=100, description="가져올 최대 메시지 수"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    대화의 메시지 목록 조회

    - **conversation_id**: 대화 ID
    - **skip**: 페이지네이션을 위한 오프셋
    - **limit**: 한 번에 가져올 메시지 수 (최대 100)
    """
    # 대화 소유권 확인
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다"
        )

    # 메시지 조회 (시간순)
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(
        Message.created_at
    ).offset(skip).limit(limit).all()

    return messages


@router.post("/{conversation_id}/messages/stream")
async def stream_chat_message(
    conversation_id: UUID,
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    스트리밍 방식으로 AI 응답 받기

    - **conversation_id**: 대화 ID
    - **content**: 사용자 메시지 내용
    - 실시간으로 AI 응답을 스트리밍으로 반환합니다
    """
    # 대화 소유권 확인
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다"
        )

    # AI 캐릭터 정보 가져오기
    character = db.query(AICharacter).filter(
        AICharacter.id == conversation.character_id
    ).first()

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI 캐릭터를 찾을 수 없습니다"
        )

    # 사용자 메시지 저장
    user_message = Message(
        conversation_id=conversation_id,
        role="user",
        content=message_data.content
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    # 감정 감지 (비동기)
    emotion_data = await detect_emotion(message_data.content)

    # 감정 정보 로깅 (디버깅용)
    if emotion_data.get("intensity", 0) > 0.3:
        emotion_summary = format_emotion_summary(emotion_data)
        print(f"🎭 감정 감지: {emotion_summary}")

    # 컨텍스트 구축 (메모리 + 요약 + 최근 메시지 + 감정 + Advanced Prompting)
    context = build_conversation_context(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id,
        character=character,
        emotion_data=emotion_data,
        use_advanced_prompting=True  # Advanced Prompt Engineering 활성화
    )

    # 토큰 제한에 맞춰 최적화
    context = optimize_context_for_token_limit(context, max_tokens=4000)

    # 메시지 추출
    messages = context["messages"]

    # 스트리밍 응답 생성
    async def generate():
        raw_response = ""  # 필터링 전 원본
        start_time = datetime.utcnow()  # 응답 시작 시간

        try:
            # 1단계: 전체 AI 응답 수집
            async for chunk in stream_gemini_response(messages):
                raw_response += chunk

            # 응답 완료 시간
            end_time = datetime.utcnow()
            response_time_ms = (end_time - start_time).total_seconds() * 1000

            # 2단계: 내부 프로세스 필터링
            full_response = filter_internal_process(raw_response)

            # 3단계: 필터링된 응답을 빠르게 chunk로 나눠서 스트리밍
            # (사용자 경험을 위해 즉각적인 표시처럼 보이게)
            chunk_size = 20  # 20자씩 전송
            for i in range(0, len(full_response), chunk_size):
                chunk = full_response[i:i + chunk_size]
                yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"

            # AI 응답 저장 (필터링된 버전)
            ai_message = Message(
                conversation_id=conversation_id,
                role="assistant",
                content=full_response
            )
            db.add(ai_message)

            # 대화 객체 다시 가져오기 (세션 분리 문제 해결)
            conv = db.query(Conversation).filter(
                Conversation.id == conversation_id
            ).first()

            if conv:
                # 대화 타임스탬프 업데이트
                conv.updated_at = datetime.utcnow()

                # 첫 메시지인 경우 제목 자동 생성
                if not conv.title:
                    # 첫 사용자 메시지를 제목으로 사용 (최대 50자)
                    conv.title = message_data.content[:50]
                    if len(message_data.content) > 50:
                        conv.title += "..."

            db.commit()
            db.refresh(ai_message)

            # 메트릭 자동 수집 (응답 시간, 토큰 수 등)
            update_conversation_metrics(
                db=db,
                conversation_id=conversation_id,
                user_content=message_data.content,
                ai_content=full_response,
                response_time_ms=response_time_ms
            )

            # 대화 요약 필요 여부 확인 및 자동 생성
            if check_summary_trigger(db, conversation_id):
                await create_conversation_summary(db, conversation_id)

            # 사용자 메모리 업데이트 (10개 메시지마다)
            if should_update_memory(db, conversation_id):
                await update_user_memory(
                    db=db,
                    conversation_id=conversation_id,
                    user_id=current_user.id,
                    character_id=character.id
                )

            # 완료 신호 전송
            yield f"data: {json.dumps({'type': 'done', 'message_id': str(ai_message.id)})}\n\n"

        except Exception as e:
            # 오류 발생 시 전송
            print(f"스트리밍 오류: {str(e)}")
            yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # nginx 버퍼링 비활성화
        }
    )


@router.get("/{conversation_id}/summaries")
async def get_conversation_summaries(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    대화 요약 목록 조회

    - **conversation_id**: 대화 ID
    - 해당 대화의 모든 요약을 시간순으로 반환합니다
    """
    # 대화 소유권 확인
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="대화를 찾을 수 없습니다"
        )

    # 요약 조회
    summaries = db.query(ConversationSummary).filter(
        ConversationSummary.conversation_id == conversation_id
    ).order_by(
        ConversationSummary.created_at
    ).all()

    return {
        "summaries": [
            {
                "id": str(summary.id),
                "summary": summary.summary,
                "message_count": summary.message_count,
                "created_at": summary.created_at.isoformat()
            }
            for summary in summaries
        ],
        "total_count": len(summaries)
    }
