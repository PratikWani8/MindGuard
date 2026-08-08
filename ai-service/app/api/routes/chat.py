from fastapi import APIRouter, Request
from app.schemas.common import ChatRequest
from app.utils.safety import classify_safety

router = APIRouter()


@router.post("/chat")
def chat(request: Request, body: ChatRequest):
    safety = classify_safety(body.message)
    return request.app.state.chat_service.respond(
        body.message,
        [x.model_dump() for x in body.conversation],
        safety,
    )
