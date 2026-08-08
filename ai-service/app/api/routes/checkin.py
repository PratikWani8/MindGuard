from fastapi import APIRouter
from app.schemas.common import CheckinRequest
from app.services.checkin_service import analyze_checkin
from app.utils.safety import classify_safety

router = APIRouter()


@router.post("/analyze/checkin")
def checkin(body: CheckinRequest):
    safety = classify_safety(body.journalText) if body.journalText else {"high_risk": False}
    return analyze_checkin(body, safety_signal=safety["high_risk"])
