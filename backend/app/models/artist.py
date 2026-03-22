import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, Integer, Table, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


# ── Artist ↔ Genre M:N 연결 테이블 ──────────────────────────
artist_genres = Table(
    "artist_genres",
    Base.metadata,
    Column(
        "artist_id",
        UUID(as_uuid=True),
        ForeignKey("artists.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "genre_id",
        Integer,
        ForeignKey("genres.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Artist(Base):
    __tablename__ = "artists"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    spotify_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    introduction: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    spotify_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    # 수동 입력 링크 (manual_data.py에서 주입)
    youtube_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    album_youtube_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    instagram_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # ── Relationships ─────────────────────────────────────
    genres: Mapped[list["Genre"]] = relationship(
        "Genre", secondary=artist_genres, back_populates="artists", lazy="joined"
    )
    albums: Mapped[list["Album"]] = relationship(
        "Album", back_populates="artist", cascade="all, delete-orphan"
    )
    audio_features: Mapped["AudioFeatures | None"] = relationship(
        "AudioFeatures",
        back_populates="artist",
        uselist=False,
        cascade="all, delete-orphan",
    )


class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    artists: Mapped[list["Artist"]] = relationship(
        "Artist", secondary=artist_genres, back_populates="genres"
    )


# ── 순환 import 방지를 위한 지연 import ──────────────────────
from app.models.album import Album           # noqa: E402, F401
from app.models.audio_features import AudioFeatures  # noqa: E402, F401
