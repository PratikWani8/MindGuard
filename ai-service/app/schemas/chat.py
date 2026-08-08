"""Schemas for chat endpoints."""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime
from app.config import settings


class ChatMessage(BaseModel):
    """Single chat message."""
    role: str = Field(..., description="Message role: user or assistant")
    content: str = Field(..., min_length=1, description="Message content")
    timestamp: Optional[datetime] = Field(None, description="Message timestamp")
    
    @field_validator('role')
    @classmethod
    def validate_role(cls, v: str) -> str:
        """Validate message role."""
        if v not in ['user', 'assistant']:
            raise ValueError("Role must be 'user' or 'assistant'")
        return v


class ChatRequest(BaseModel):
    """Request schema for chat endpoint."""
    message: str = Field(..., min_length=1, description="User message")
    conversation: List[ChatMessage] = Field(default_factory=list, description="Conversation history")
    
    @field_validator('message')
    @classmethod
    def validate_message_length(cls, v: str) -> str:
        """Validate message length."""
        if len(v) > settings.max_text_length:
            raise ValueError(f"Message exceeds maximum length of {settings.max_text_length} characters")
        return v.strip()
    
    @field_validator('conversation')
    @classmethod
    def validate_conversation(cls, v: List[ChatMessage]) -> List[ChatMessage]:
        """Validate conversation history."""
        if len(v) > 50:
            # Keep only the most recent messages
            return v[-50:]
        return v


class ChatSource(BaseModel):
    """Source reference for RAG-based responses."""
    title: str = Field(..., description="Source title")
    source: str = Field(..., description="Source identifier or URL")
    relevance_score: Optional[float] = Field(None, ge=0, le=1, description="Relevance score")


class ChatResponse(BaseModel):
    """Response schema for chat endpoint."""
    message: str = Field(..., description="AI response message")
    sources: List[ChatSource] = Field(default_factory=list, description="Source references")
    intent: Optional[str] = Field(None, description="Detected user intent")
    requiresHumanSupport: bool = Field(default=False, description="Whether human support is recommended")
    supportLevel: Optional[str] = Field(None, description="Support level if applicable")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "I understand you're feeling stressed about your exams. It's completely normal to feel this way during exam periods. Here are some strategies that might help...",
                "sources": [
                    {
                        "title": "Managing Academic Stress",
                        "source": "mental_health_resources/academic_stress.md",
                        "relevance_score": 0.89
                    }
                ],
                "intent": "seeking_coping_strategies",
                "requiresHumanSupport": false,
                "supportLevel": "stable"
            }
        }
