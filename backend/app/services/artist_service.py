import uuid
from sqlalchemy.orm import Session
from app.repositories.artist_repo import ArtistRepository
from app.services.mood_service import build_mood_schema, build_default_mood
from app.schemas.artist import (
    ArtistListItem,
    ArtistDetail,
    ArtistListResponse,
    ArtistDetailResponse,
    FeaturedAlbumBrief,
    FeaturedAlbumFull,
    FeaturedTrackSchema,
    TrackSchema,
    PaginationMeta,
)
from app.schemas.genre import GenreItem, GenreListResponse
from fastapi import HTTPException


class ArtistService:
    """
    비즈니스 로직 레이어.
    Repository에서 ORM 모델을 받아 Pydantic 스키마로 변환.
    mood_tag 파생 로직도 여기서 처리.
    """

    def __init__(self, db: Session):
        self.repo = ArtistRepository(db)

    def get_artist_list(
        self,
        genre: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> ArtistListResponse:
        artists, total = self.repo.get_all(genre=genre, limit=limit, offset=offset)

        items = [self._to_list_item(a) for a in artists]

        return ArtistListResponse(
            data=items,
            meta=PaginationMeta(total=total, limit=limit, offset=offset),
        )

    def get_artist_detail(self, artist_id: uuid.UUID) -> ArtistDetailResponse:
        artist = self.repo.get_by_id(artist_id)
        if not artist:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "ARTIST_NOT_FOUND",
                    "message": f"Artist with id '{artist_id}' does not exist",
                    "status": 404,
                },
            )
        return ArtistDetailResponse(data=self._to_detail(artist))

    def get_genre_list(self) -> GenreListResponse:
        rows = self.repo.get_genres_with_count()
        return GenreListResponse(
            data=[
                GenreItem(id=genre.id, name=genre.name, artist_count=count)
                for genre, count in rows
            ]
        )

    # ── Private 변환 메서드 ────────────────────────────────

    def _build_mood(self, artist):
        if artist.audio_features:
            return build_mood_schema(artist.audio_features)
        return build_default_mood()

    def _featured_album(self, artist):
        """is_featured=True 앨범 또는 첫 번째 앨범"""
        featured = next(
            (a for a in artist.albums if a.is_featured),
            artist.albums[0] if artist.albums else None,
        )
        return featured

    def _to_list_item(self, artist) -> ArtistListItem:
        album = self._featured_album(artist)

        return ArtistListItem(
            id=artist.id,
            name=artist.name,
            introduction=artist.introduction,
            image_url=artist.image_url,
            spotify_url=artist.spotify_url,
            genres=[g.name for g in artist.genres],
            mood=self._build_mood(artist),
            featured_album=FeaturedAlbumBrief(
                id=album.id,
                name=album.name,
                image_url=album.image_url,
            ) if album else FeaturedAlbumBrief(id=artist.id, name="", image_url=None),
        )

    def _to_detail(self, artist) -> ArtistDetail:
        album = self._featured_album(artist)
        featured_track = None

        if album:
            ft = next((t for t in album.tracks if t.is_featured), None)
            if ft:
                featured_track = FeaturedTrackSchema(
                    name=ft.name,
                    youtube_url=artist.youtube_url,
                )

        return ArtistDetail(
            id=artist.id,
            name=artist.name,
            introduction=artist.introduction,
            image_url=artist.image_url,
            spotify_url=artist.spotify_url,
            youtube_url=artist.youtube_url,
            album_youtube_url=artist.album_youtube_url,
            instagram_url=artist.instagram_url,
            genres=[g.name for g in artist.genres],
            mood=self._build_mood(artist),
            featured_album=FeaturedAlbumFull(
                id=album.id,
                name=album.name,
                image_url=album.image_url,
                release_date=album.release_date,
                tracks=[
                    TrackSchema(
                        number=t.track_number,
                        name=t.name,
                        is_featured=t.is_featured,
                    )
                    for t in album.tracks
                ],
            ) if album else FeaturedAlbumFull(
                id=artist.id, name="", image_url=None,
                release_date=None, tracks=[]
            ),
            featured_track=featured_track,
        )
