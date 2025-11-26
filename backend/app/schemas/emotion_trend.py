"""주간 감정 트렌드 데이터 스키마"""
from pydantic import BaseModel
from datetime import date
from typing import List


class EmotionTrendPoint(BaseModel):
    """일별 감정 데이터 포인트"""
    date: date
    emotion_type: str
    avg_intensity: float
    count: int
    
    class Config:
        from_attributes = True


class WeeklyEmotionTrend(BaseModel):
    """주간 감정 트렌드"""
    start_date: date
    end_date: date
    data_points: List[EmotionTrendPoint]
