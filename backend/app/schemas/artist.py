import uuid
from datetime import date
from pydantic import BaseModel
from app.schemas.mood import MoodSchema


# ── Track ─────────────────────────────────────────────────
class TrackSchema(BaseModel):
    number: int
    name: str
    is_featured: bool

    model_config = {"from_attributes": True}


# ── Album (목록용 요약) ────────────────────────────────────
class FeaturedAlbumBrief(BaseModel):
    id: uuid.UUID
    name: str
    image_url: str | None

    model_config = {"from_attributes": True}


# ── Album (상세용 전체) ────────────────────────────────────
class FeaturedAlbumFull(FeaturedAlbumBrief):
    release_date: date | None
    tracks: list[TrackSchema]


# ── FeaturedTrack ──────────────────────────────────────────
class FeaturedTrackSchema(BaseModel):
    name: str
    youtube_url: str | None

    model_config = {"from_attributes": True}


# ── Artist 목록 아이템 ─────────────────────────────────────
class ArtistListItem(BaseModel):
    """
    GET /api/v1/artists 응답 아이템.
    GalleryPage CircularCarousel에서 사용.
    """

    id: uuid.UUID
    name: str
    introduction: str | None
    image_url: str | None
    spotify_url: str | None
    genres: list[str]
    mood: MoodSchema
    featured_album: FeaturedAlbumBrief

    model_config = {"from_attributes": True}


# ── Artist 상세 ────────────────────────────────────────────
class ArtistDetail(ArtistListItem):
    """
    GET /api/v1/artists/{id} 응답.
    ArtistPage CardFront / CardBack / LinkCube에서 사용.
    """

    youtube_url: str | None
    album_youtube_url: str | None
    instagram_url: str | None
    featured_album: FeaturedAlbumFull
    featured_track: FeaturedTrackSchema | None


# ── 목록 응답 래퍼 ─────────────────────────────────────────
class PaginationMeta(BaseModel):
    total: int
    limit: int
    offset: int


class ArtistListResponse(BaseModel):
    data: list[ArtistListItem]
    meta: PaginationMeta


class ArtistDetailResponse(BaseModel):
    data: ArtistDetail
