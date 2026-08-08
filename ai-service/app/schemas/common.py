from pydantic import BaseModel, Field, field_validator


class JournalRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)


class CheckinRequest(BaseModel):
    mood: int = Field(ge=1, le=5)
    stressLevel: int = Field(ge=1, le=10)
    energyLevel: int = Field(ge=1, le=10)
    sleepHours: float = Field(ge=0, le=24)
    sleepQuality: int = Field(ge=1, le=5)
    focusLevel: int = Field(ge=1, le=10)
    journalText: str = Field(default="", max_length=5000)


class TrendRequest(BaseModel):
    checkins: list[CheckinRequest] = Field(min_length=0, max_length=365)


class ChatMessage(BaseModel):
    role: str = Field(pattern=r"^(user|assistant|system)$")
    content: str = Field(min_length=1, max_length=5000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)
    conversation: list[ChatMessage] = Field(default_factory=list, max_length=30)
