from fastapi import APIRouter, Request
from app.schemas.common import JournalRequest
from app.services.journal_service import analyze_journal

router = APIRouter()


@router.post("/analyze/journal")
def journal(request: Request, body: JournalRequest):
    return analyze_journal(body.text, request.app.state.sentiment_model, request.app.state.emotion_model)
