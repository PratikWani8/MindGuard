"""Schemas for trend analysis endpoints."""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime
from app.schemas.common import SupportLevel


class CheckinData(BaseModel):
    """Individual check-in data point."""
    timestamp: datetime = Field(..., description="Check-in timestamp")
    mood: int = Field(..., ge=1, le=10)
    stressLevel: int = Field(..., ge=1, le=10)
    energyLevel: int = Field(..., ge=1, le=10)
    sleepHours: float = Field(..., ge=0, le=24)
    sleepQuality: int = Field(..., ge=1, le=10)
    focusLevel: int = Field(..., ge=1, le=10)
    wellbeingScore: Optional[float] = Field(None, ge=0, le=100)


class TrendAnalysisRequest(BaseModel):
    """Request schema for trend analysis."""
    checkins: List[CheckinData] = Field(..., min_length=1, description="List of check-in data points")
    
    @field_validator('checkins')
    @classmethod
    def validate_checkins(cls, v: List[CheckinData]) -> List[CheckinData]:
        """Validate check-ins list."""
        if len(v) < 2:
            # If only one check-in, we can still analyze but trends will be limited
            return v
        # Sort by timestamp
        return sorted(v, key=lambda x: x.timestamp)


class TrendDirection(BaseModel):
    """Trend direction and strength."""
    direction: str = Field(..., description="improving, stable, or declining")
    strength: float = Field(..., ge=0, le=1, description="Trend strength (0-1)")
    change_percentage: float = Field(..., description="Percentage change")


class DetectedPattern(BaseModel):
    """Detected behavioral pattern."""
    pattern: str = Field(..., description="Pattern type")
    confidence: float = Field(..., ge=0, le=1, description="Detection confidence")
    description: str = Field(..., description="Pattern description")
    first_detected: datetime = Field(..., description="When pattern first appeared")


class TrendAnalysisResponse(BaseModel):
    """Response schema for trend analysis."""
    moodTrend: TrendDirection = Field(..., description="Mood trend analysis")
    stressTrend: TrendDirection = Field(..., description="Stress trend analysis")
    sleepTrend: TrendDirection = Field(..., description="Sleep trend analysis")
    energyTrend: TrendDirection = Field(..., description="Energy trend analysis")
    focusTrend: TrendDirection = Field(..., description="Focus trend analysis")
    wellbeingTrend: TrendDirection = Field(..., description="Overall wellbeing trend")
    detectedPatterns: List[DetectedPattern] = Field(default_factory=list, description="Detected patterns")
    supportLevel: SupportLevel = Field(..., description="Required support level based on trends")
    insights: List[str] = Field(default_factory=list, description="Trend insights")
    recommendations: List[str] = Field(default_factory=list, description="Recommendations based on trends")
    
    class Config:
        json_schema_extra = {
            "example": {
                "moodTrend": {
                    "direction": "declining",
                    "strength": 0.72,
                    "change_percentage": -15.3
                },
                "stressTrend": {
                    "direction": "increasing",
                    "strength": 0.85,
                    "change_percentage": 25.7
                },
                "sleepTrend": {
                    "direction": "declining",
                    "strength": 0.68,
                    "change_percentage": -12.5
                },
                "energyTrend": {
                    "direction": "declining",
                    "strength": 0.55,
                    "change_percentage": -8.2
                },
                "focusTrend": {
                    "direction": "stable",
                    "strength": 0.25,
                    "change_percentage": -2.1
                },
                "wellbeingTrend": {
                    "direction": "declining",
                    "strength": 0.78,
                    "change_percentage": -18.4
                },
                "detectedPatterns": [
                    {
                        "pattern": "increasing_stress",
                        "confidence": 0.88,
                        "description": "Stress levels have been consistently rising over the past week",
                        "first_detected": "2024-01-15T10:00:00Z"
                    }
                ],
                "supportLevel": "elevated",
                "insights": [
                    "Your stress has been increasing while sleep quality declines.",
                    "This pattern often indicates growing pressure or workload."
                ],
                "recommendations": [
                    "Consider reviewing your current commitments and priorities.",
                    "Establish a consistent sleep routine.",
                    "Schedule regular breaks during your day."
                ]
            }
        }
