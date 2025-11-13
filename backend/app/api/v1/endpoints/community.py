from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from uuid import UUID

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostListResponse, PostAuthor
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse, CommentListResponse, CommentAuthor
from app.schemas.like import LikeCreate, LikeResponse

router = APIRouter()


def format_author(user: Optional[User], is_anonymous: bool) -> Optional[PostAuthor]:
    """작성자 정보 포맷팅 (익명 처리)"""
    if is_anonymous or not user:
        return PostAuthor(
            id=None,
            nickname="익명",
            profile_image_url=None
        )
    return PostAuthor(
        id=user.id,
        nickname=user.nickname,
        profile_image_url=user.profile_image_url
    )


# ========================================
# Post Endpoints
# ========================================

@router.get(
    "/posts",
    response_model=PostListResponse,
    summary="게시글 목록 조회",
    description="커뮤니티 게시글 목록을 페이지네이션과 함께 조회합니다"
)
async def get_posts(
    page: int = Query(1, ge=1, description="페이지 번호"),
    page_size: int = Query(20, ge=1, le=100, description="페이지 크기"),
    sort: str = Query("latest", regex="^(latest|popular)$", description="정렬 방식 (latest: 최신순, popular: 인기순)"),
    search: Optional[str] = Query(None, description="검색어 (제목 또는 내용)"),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """게시글 목록 조회"""
    offset = (page - 1) * page_size

    # 기본 쿼리
    query = db.query(Post)

    # 검색 필터
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Post.title.ilike(search_pattern),
                Post.content.ilike(search_pattern)
            )
        )

    # 정렬
    if sort == "popular":
        query = query.order_by(Post.num_likes.desc(), Post.created_at.desc())
    else:  # latest
        query = query.order_by(Post.created_at.desc())

    # 전체 개수
    total = query.count()

    # 페이지네이션
    posts = query.offset(offset).limit(page_size).all()

    # 응답 포맷팅
    post_responses = []
    for post in posts:
        # 사용자가 로그인한 경우 좋아요 여부 확인
        is_liked = None
        if current_user:
            like = db.query(Like).filter(
                Like.user_id == current_user.id,
                Like.post_id == post.id
            ).first()
            is_liked = like is not None

        post_response = PostResponse(
            **post.__dict__,
            user=format_author(post.user, post.is_anonymous),
            is_liked=is_liked
        )
        post_responses.append(post_response)

    return PostListResponse(
        posts=post_responses,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get(
    "/posts/{post_id}",
    response_model=PostResponse,
    summary="게시글 상세 조회",
    description="특정 게시글의 상세 정보를 조회합니다"
)
async def get_post(
    post_id: UUID,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """게시글 상세 조회"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    # 사용자가 로그인한 경우 좋아요 여부 확인
    is_liked = None
    if current_user:
        like = db.query(Like).filter(
            Like.user_id == current_user.id,
            Like.post_id == post.id
        ).first()
        is_liked = like is not None

    return PostResponse(
        **post.__dict__,
        user=format_author(post.user, post.is_anonymous),
        is_liked=is_liked
    )


@router.post(
    "/posts",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="게시글 작성",
    description="새로운 게시글을 작성합니다"
)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """게시글 작성"""
    # 익명 게시일 경우 user_id를 None으로 설정
    user_id = None if post_data.is_anonymous else current_user.id

    post = Post(
        user_id=user_id,
        title=post_data.title,
        content=post_data.content,
        is_anonymous=post_data.is_anonymous
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return PostResponse(
        **post.__dict__,
        user=format_author(current_user, post_data.is_anonymous),
        is_liked=False
    )


@router.put(
    "/posts/{post_id}",
    response_model=PostResponse,
    summary="게시글 수정",
    description="자신이 작성한 게시글을 수정합니다"
)
async def update_post(
    post_id: UUID,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """게시글 수정"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    # 작성자 확인 (익명 게시글은 수정 불가)
    if post.is_anonymous or post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="게시글을 수정할 권한이 없습니다")

    # 업데이트
    if post_data.title is not None:
        post.title = post_data.title
    if post_data.content is not None:
        post.content = post_data.content

    db.commit()
    db.refresh(post)

    # 좋아요 여부 확인
    like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.post_id == post.id
    ).first()

    return PostResponse(
        **post.__dict__,
        user=format_author(post.user, post.is_anonymous),
        is_liked=like is not None
    )


@router.delete(
    "/posts/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="게시글 삭제",
    description="자신이 작성한 게시글을 삭제합니다"
)
async def delete_post(
    post_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """게시글 삭제"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    # 작성자 확인 (익명 게시글은 삭제 불가)
    if post.is_anonymous or post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="게시글을 삭제할 권한이 없습니다")

    db.delete(post)
    db.commit()


# ========================================
# Comment Endpoints
# ========================================

@router.get(
    "/posts/{post_id}/comments",
    response_model=CommentListResponse,
    summary="댓글 목록 조회",
    description="특정 게시글의 댓글 목록을 조회합니다"
)
async def get_comments(
    post_id: UUID,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """댓글 목록 조회"""
    # 게시글 존재 확인
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    # 댓글 조회
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).all()

    # 응답 포맷팅
    comment_responses = []
    for comment in comments:
        # 댓글 좋아요 수
        num_likes = db.query(func.count(Like.id)).filter(Like.comment_id == comment.id).scalar()

        # 사용자가 로그인한 경우 좋아요 여부 확인
        is_liked = None
        if current_user:
            like = db.query(Like).filter(
                Like.user_id == current_user.id,
                Like.comment_id == comment.id
            ).first()
            is_liked = like is not None

        comment_response = CommentResponse(
            **comment.__dict__,
            user=CommentAuthor(
                id=None if comment.is_anonymous else comment.user_id,
                nickname="익명" if comment.is_anonymous else (comment.user.nickname if comment.user else "알 수 없음"),
                profile_image_url=None if comment.is_anonymous else (comment.user.profile_image_url if comment.user else None)
            ),
            num_likes=num_likes,
            is_liked=is_liked
        )
        comment_responses.append(comment_response)

    return CommentListResponse(
        comments=comment_responses,
        total=len(comments)
    )


@router.post(
    "/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="댓글 작성",
    description="게시글에 댓글을 작성합니다"
)
async def create_comment(
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """댓글 작성"""
    # 게시글 존재 확인
    post = db.query(Post).filter(Post.id == comment_data.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

    # 익명 댓글일 경우 user_id를 None으로 설정
    user_id = None if comment_data.is_anonymous else current_user.id

    comment = Comment(
        post_id=comment_data.post_id,
        user_id=user_id,
        content=comment_data.content,
        is_anonymous=comment_data.is_anonymous
    )

    db.add(comment)

    # 게시글 댓글 수 증가
    post.num_comments += 1

    db.commit()
    db.refresh(comment)

    return CommentResponse(
        **comment.__dict__,
        user=CommentAuthor(
            id=None if comment_data.is_anonymous else current_user.id,
            nickname="익명" if comment_data.is_anonymous else current_user.nickname,
            profile_image_url=None if comment_data.is_anonymous else current_user.profile_image_url
        ),
        num_likes=0,
        is_liked=False
    )


@router.put(
    "/comments/{comment_id}",
    response_model=CommentResponse,
    summary="댓글 수정",
    description="자신이 작성한 댓글을 수정합니다"
)
async def update_comment(
    comment_id: UUID,
    comment_data: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """댓글 수정"""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")

    # 작성자 확인 (익명 댓글은 수정 불가)
    if comment.is_anonymous or comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="댓글을 수정할 권한이 없습니다")

    comment.content = comment_data.content
    db.commit()
    db.refresh(comment)

    # 댓글 좋아요 수
    num_likes = db.query(func.count(Like.id)).filter(Like.comment_id == comment.id).scalar()

    # 좋아요 여부 확인
    like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.comment_id == comment.id
    ).first()

    return CommentResponse(
        **comment.__dict__,
        user=CommentAuthor(
            id=comment.user_id,
            nickname=comment.user.nickname,
            profile_image_url=comment.user.profile_image_url
        ),
        num_likes=num_likes,
        is_liked=like is not None
    )


@router.delete(
    "/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="댓글 삭제",
    description="자신이 작성한 댓글을 삭제합니다"
)
async def delete_comment(
    comment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """댓글 삭제"""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")

    # 작성자 확인 (익명 댓글은 삭제 불가)
    if comment.is_anonymous or comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="댓글을 삭제할 권한이 없습니다")

    # 게시글 댓글 수 감소
    post = db.query(Post).filter(Post.id == comment.post_id).first()
    if post:
        post.num_comments = max(0, post.num_comments - 1)

    db.delete(comment)
    db.commit()


# ========================================
# Like Endpoints
# ========================================

@router.post(
    "/likes",
    response_model=LikeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="좋아요 추가",
    description="게시글 또는 댓글에 좋아요를 추가합니다"
)
async def create_like(
    like_data: LikeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """좋아요 추가"""
    # 게시글 좋아요
    if like_data.post_id:
        # 게시글 존재 확인
        post = db.query(Post).filter(Post.id == like_data.post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")

        # 이미 좋아요한 경우
        existing_like = db.query(Like).filter(
            Like.user_id == current_user.id,
            Like.post_id == like_data.post_id
        ).first()
        if existing_like:
            raise HTTPException(status_code=400, detail="이미 좋아요한 게시글입니다")

        like = Like(
            user_id=current_user.id,
            post_id=like_data.post_id
        )

        # 게시글 좋아요 수 증가
        post.num_likes += 1

    # 댓글 좋아요
    elif like_data.comment_id:
        # 댓글 존재 확인
        comment = db.query(Comment).filter(Comment.id == like_data.comment_id).first()
        if not comment:
            raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")

        # 이미 좋아요한 경우
        existing_like = db.query(Like).filter(
            Like.user_id == current_user.id,
            Like.comment_id == like_data.comment_id
        ).first()
        if existing_like:
            raise HTTPException(status_code=400, detail="이미 좋아요한 댓글입니다")

        like = Like(
            user_id=current_user.id,
            comment_id=like_data.comment_id
        )
    else:
        raise HTTPException(status_code=400, detail="post_id 또는 comment_id가 필요합니다")

    db.add(like)
    db.commit()
    db.refresh(like)

    return LikeResponse(**like.__dict__)


@router.delete(
    "/likes",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="좋아요 취소",
    description="게시글 또는 댓글의 좋아요를 취소합니다"
)
async def delete_like(
    post_id: Optional[UUID] = Query(None, description="게시글 ID"),
    comment_id: Optional[UUID] = Query(None, description="댓글 ID"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """좋아요 취소"""
    if not post_id and not comment_id:
        raise HTTPException(status_code=400, detail="post_id 또는 comment_id가 필요합니다")

    # 게시글 좋아요 취소
    if post_id:
        like = db.query(Like).filter(
            Like.user_id == current_user.id,
            Like.post_id == post_id
        ).first()
        if not like:
            raise HTTPException(status_code=404, detail="좋아요를 찾을 수 없습니다")

        # 게시글 좋아요 수 감소
        post = db.query(Post).filter(Post.id == post_id).first()
        if post:
            post.num_likes = max(0, post.num_likes - 1)

    # 댓글 좋아요 취소
    elif comment_id:
        like = db.query(Like).filter(
            Like.user_id == current_user.id,
            Like.comment_id == comment_id
        ).first()
        if not like:
            raise HTTPException(status_code=404, detail="좋아요를 찾을 수 없습니다")

    db.delete(like)
    db.commit()
