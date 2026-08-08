"""Schemas for journal analysis endpoints."""
from pydantic import BaseModel, Field, field_validator
from typing import List
from app.schemas.common import SentimentResult, EmotionResult, SupportLevel
from app.config import settings


class JournalAnalysisRequest(BaseModel):
    """Request schema for journal analysis."""
    text: str = Field(..., min_length=1, description="Journal entry text")
    
    @field_validator('text')
    @classmethod
    def validate_text_length(cls, v: str) -> str:
        """Validate text length."""
        if len(v) > settings.max_text_length:
            raise ValueError(f"Text exceeds maximum length of {settings.max_text_length} characters")
        return v.strip()


class JournalAnalysisResponse(BaseModel):
    """Response schema for journal analysis."""
    sentiment: SentimentResult = Field(..., description="Sentiment analysis result")
    emotions: EmotionResult = Field(..., description="Emotion detection result")
    topics: List[str] = Field(default_factory=list, description="Extracted topics")
    stressIndicators: List[str] = Field(default_factory=list, description="Detected stress indicators")
    supportLevel: SupportLevel = Field(..., description="Required support level")
    insights: List[str] = Field(default_factory=list, description="Generated insights")
    recommendations: List[str] = Field(default_factory=list, description="Personalized recommendations")
    
    class Config:
        json_schema_extra = {
            "example": {
                "sentiment": {
                    "label": "negative",
                    "score": 0.82
                },
                "emotions": {
                    "anxiety": 0.81,
                    "stress": 0.87,
                    "sadness": 0.34,
                    "anger": 0.08,
                    "joy": 0.05
                },
                "topics": ["academic pressure", "exams"],
                "stressIndicators": ["academic pressure", "sleep concerns"],
                "supportLevel": "elevated",
                "insights": [
                    "Recent text indicates increased stress related to academic pressure."
                ],
                "recommendations": [
                    "Consider taking short recovery breaks.",
                    "Create a realistic study schedule."
                ]
            }
        }
