import uuid
from datetime import datetime
from sqlalchemy import Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class AudioFeatures(Base):
    """
    Spotify Audio Features — 아티스트별 대표 트랙 수치.
    MoodParticles 시각 파라미터의 데이터 소스.

    energy:      0.0~1.0  → 파티클 속도
    valence:     0.0~1.0  → 파티클 색상 (차갑다/따뜻하다)
    tempo:       BPM      → 파티클 밀도 / pulse 주기
    danceability:0.0~1.0  → 파티클 흩어짐 정도
    """

    __tablename__ = "audio_features"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    artist_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("artists.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,  # 아티스트당 1개
    )

    energy: Mapped[float] = mapped_column(Float, nullable=False)
    valence: Mapped[float] = mapped_column(Float, nullable=False)
    tempo: Mapped[float] = mapped_column(Float, nullable=False)
    danceability: Mapped[float] = mapped_column(Float, nullable=False)

    fetched_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # ── Relationships ─────────────────────────────────────
    artist: Mapped["Artist"] = relationship("Artist", back_populates="audio_features")


from app.models.artist import Artist  # noqa: E402, F401
