import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import String, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base


class EventType(str, Enum):
    """허용된 인터랙션 이벤트 타입"""
    CARD_VIEW     = "card_view"      # 카드 갤러리에서 뷰포트 진입
    CARD_CLICK    = "card_click"     # 카드 클릭 → 아티스트 페이지 이동
    CARD_FLIP     = "card_flip"      # 카드 앞면/뒷면 전환
    LINK_CLICK    = "link_click"     # YouTube/Spotify/Instagram 큐브 클릭
    SEARCH_QUERY  = "search_query"   # 검색어 입력
    SEARCH_SELECT = "search_select"  # 검색 결과 선택
    PAGE_ENTER    = "page_enter"     # 아티스트 페이지 진입
    PAGE_EXIT     = "page_exit"      # 아티스트 페이지 이탈 (체류 시간 포함)


class InteractionLog(Base):
    __tablename__ = "interaction_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    session_id: Mapped[str] = mapped_column(String(128), nullable=False)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False)

    # 아티스트 무관 이벤트(search_query 등)는 NULL 허용
    artist_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("artists.id", ondelete="SET NULL"),
        nullable=True,
    )

    # 이벤트별 추가 데이터 (platform, duration_ms, query 등)
    metadata: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # ── 조회 성능 인덱스 ──────────────────────────────────
    __table_args__ = (
        Index("idx_logs_session",  "session_id"),
        Index("idx_logs_event",    "event_type"),
        Index("idx_logs_artist",   "artist_id"),
        Index("idx_logs_created",  "created_at"),
    )
