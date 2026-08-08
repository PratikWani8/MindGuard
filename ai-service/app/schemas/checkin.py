"""Schemas for check-in analysis endpoints."""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from app.schemas.common import SupportLevel
from app.config import settings


class CheckinAnalysisRequest(BaseModel):
    """Request schema for check-in analysis."""
    mood: int = Field(..., ge=1, le=10, description="Mood level (1-10)")
    stressLevel: int = Field(..., ge=1, le=10, description="Stress level (1-10)")
    energyLevel: int = Field(..., ge=1, le=10, description="Energy level (1-10)")
    sleepHours: float = Field(..., ge=0, le=24, description="Hours of sleep")
    sleepQuality: int = Field(..., ge=1, le=10, description="Sleep quality (1-10)")
    focusLevel: int = Field(..., ge=1, le=10, description="Focus level (1-10)")
    journalText: Optional[str] = Field(None, description="Optional journal text")
    
    @field_validator('journalText')
    @classmethod
    def validate_journal_text(cls, v: Optional[str]) -> Optional[str]:
        """Validate journal text length if provided."""
        if v is None:
            return v
        if len(v) > settings.max_text_length:
            raise ValueError(f"Journal text exceeds maximum length of {settings.max_text_length} characters")
        return v.strip()


class WellbeingScore(BaseModel):
    """Wellbeing score breakdown."""
    overall: float = Field(..., ge=0, le=100, description="Overall wellbeing score (0-100)")
    mood_component: float = Field(..., ge=0, le=100, description="Mood contribution")
    stress_component: float = Field(..., ge=0, le=100, description="Stress contribution")
    sleep_component: float = Field(..., ge=0, le=100, description="Sleep contribution")
    energy_component: float = Field(..., ge=0, le=100, description="Energy contribution")
    focus_component: float = Field(..., ge=0, le=100, description="Focus contribution")


class IndicatorStatus(BaseModel):
    """Status indicator for a specific metric."""
    status: str = Field(..., description="Status: good, fair, or poor")
    value: float = Field(..., description="Metric value")
    message: str = Field(..., description="Interpretation message")


class CheckinAnalysisResponse(BaseModel):
    """Response schema for check-in analysis."""
    wellbeingScore: WellbeingScore = Field(..., description="Wellbeing score breakdown")
    stressIndicator: IndicatorStatus = Field(..., description="Stress status")
    moodIndicator: IndicatorStatus = Field(..., description="Mood status")
    sleepIndicator: IndicatorStatus = Field(..., description="Sleep status")
    energyIndicator: IndicatorStatus = Field(..., description="Energy status")
    focusIndicator: IndicatorStatus = Field(..., description="Focus status")
    supportLevel: SupportLevel = Field(..., description="Required support level")
    recommendations: List[str] = Field(default_factory=list, description="Personalized recommendations")
    insights: List[str] = Field(default_factory=list, description="Generated insights")
    
    class Config:
        json_schema_extra = {
            "example": {
                "wellbeingScore": {
                    "overall": 58.5,
                    "mood_component": 60.0,
                    "stress_component": 40.0,
                    "sleep_component": 55.0,
                    "energy_component": 65.0,
                    "focus_component": 70.0
                },
                "stressIndicator": {
                    "status": "poor",
                    "value": 8.0,
                    "message": "Your stress level is elevated. Consider stress management techniques."
                },
                "moodIndicator": {
                    "status": "fair",
                    "value": 6.0,
                    "message": "Your mood is moderate. Small positive activities may help."
                },
                "sleepIndicator": {
                    "status": "poor",
                    "value": 5.0,
                    "message": "You may not be getting enough quality sleep."
                },
                "energyIndicator": {
                    "status": "fair",
                    "value": 4.0,
                    "message": "Your energy is below optimal. Consider rest and nutrition."
                },
                "focusIndicator": {
                    "status": "fair",
                    "value": 4.0,
                    "message": "Your focus may be affected by stress and sleep."
                },
                "supportLevel": "elevated",
                "recommendations": [
                    "Prioritize getting 7-9 hours of sleep tonight.",
                    "Try a brief breathing exercise to manage stress.",
                    "Take short breaks throughout your day."
                ],
                "insights": [
                    "High stress and low sleep may be impacting your focus and energy."
                ]
            }
        }
