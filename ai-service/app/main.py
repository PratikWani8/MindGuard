from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.models.sentiment import SentimentModel
from app.models.emotion import EmotionModel
from app.models.embeddings import EmbeddingModel
from app.services.rag_service import RAGService
from app.services.chat_service import ChatService
from app.api.routes import health, journal, checkin, trends, chat

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mindguard-ai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("Loading MindGuard AI models...")
    app.state.sentiment_model = SentimentModel(settings.sentiment_model)
    app.state.emotion_model = EmotionModel(settings.emotion_model)
    app.state.embedding_model = EmbeddingModel(settings.embedding_model)
    app.state.rag_service = RAGService(
        settings.knowledge_base_path,
        settings.vector_db_path,
        app.state.embedding_model,
    )
    app.state.chat_service = ChatService(app.state.rag_service)
    logger.info("MindGuard AI models loaded.")
    yield


app = FastAPI(
    title="MindGuard AI Service",
    version="1.0.0",
    description="Non-clinical AI mental wellness analysis and support service.",
    lifespan=lifespan,
)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(journal.router, prefix="/api/v1")
app.include_router(checkin.router, prefix="/api/v1")
app.include_router(trends.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
