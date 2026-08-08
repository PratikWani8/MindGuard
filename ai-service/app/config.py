from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ai_provider: str = "local"
    llm_api_key: str = ""
    llm_model: str = ""
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    sentiment_model: str = "distilbert-base-uncased-finetuned-sst-2-english"
    emotion_model: str = "j-hartmann/emotion-english-distilroberta-base"
    vector_db_path: str = "./data/chroma"
    knowledge_base_path: str = "./data/knowledge_base"
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    max_text_length: int = 5000

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [x.strip() for x in self.cors_origins.split(",") if x.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
