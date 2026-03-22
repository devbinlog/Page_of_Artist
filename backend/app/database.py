from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session
from typing import Generator
from app.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,       # 끊긴 연결 자동 재연결
    pool_size=10,             # 커넥션 풀 크기
    max_overflow=20,          # 풀 초과 시 최대 추가 연결 수
    echo=not settings.is_production,  # 개발 환경에서 SQL 로그 출력
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    """FastAPI Dependency — 요청마다 DB 세션 생성 및 자동 해제"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
