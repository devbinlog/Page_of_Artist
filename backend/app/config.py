from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str

    # Spotify
    spotify_client_id: str
    spotify_client_secret: str

    # App
    environment: str = "development"
    allowed_origins: list[str] = ["http://localhost:5173", "http://localhost:4173"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
