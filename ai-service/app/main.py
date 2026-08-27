from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    JournalAnalysisRequest,
    JournalAnalysisResponse,
    AgentReasoningRequest,
    AgentReasoningResponse
)

from app.services.journal_ai import analyze_journal
from app.services.agent_ai import reason_about_wellbeing

app = FastAPI(
    title="MindGuard AI Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "mindguard-ai"
    }


@app.post(
    "/api/v1/journal/analyze",
    response_model=JournalAnalysisResponse
)
async def journal_analysis(
    payload: JournalAnalysisRequest
):
    try:
        result = await analyze_journal(
            payload.userId,
            payload.text
        )

        return result

    except Exception as error:
        print("AI ERROR:", error)

        raise HTTPException(
            status_code=500,
            detail="Journal AI analysis failed"
        )


@app.post(
    "/api/v1/agent/reason",
    response_model=AgentReasoningResponse
)
async def agent_reasoning(
    payload: AgentReasoningRequest
):
    try:
        result = await reason_about_wellbeing(
            payload.userId,
            payload.context
        )

        return result

    except Exception as error:
        print("AGENT AI ERROR:", error)

        raise HTTPException(
            status_code=500,
            detail="Agent reasoning failed"
        )