#!/bin/bash

# FastAPI 서버 실행 스크립트

# 현재 디렉토리로 이동
cd "$(dirname "$0")"

# Python 경로 설정
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# 가상환경 활성화 (있는 경우)
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# uvicorn으로 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
