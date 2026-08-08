from fastapi import APIRouter
from app.schemas.common import TrendRequest
from app.services.trend_service import analyze_trends

router = APIRouter()


@router.post("/analyze/trends")
def trends(body: TrendRequest):
    return analyze_trends([x.model_dump() for x in body.checkins])
