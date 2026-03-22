import uuid
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func
from app.models.artist import Artist, Genre, artist_genres
from app.models.album import Album


class ArtistRepository:
    """
    DB 쿼리 담당 레이어.
    비즈니스 로직 없이 순수 데이터 접근만 처리.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_all(
        self,
        genre: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> tuple[list[Artist], int]:
        """아티스트 목록 + 총 개수 반환"""
        query = (
            select(Artist)
            .options(
                joinedload(Artist.genres),
                joinedload(Artist.albums).joinedload(Album.tracks),
                joinedload(Artist.audio_features),
            )
        )

        if genre:
            query = query.join(Artist.genres).where(Genre.name.ilike(f"%{genre}%"))

        total = self.db.scalar(select(func.count()).select_from(query.subquery()))
        artists = self.db.scalars(
            query.order_by(Artist.name).limit(limit).offset(offset)
        ).unique().all()

        return list(artists), total or 0

    def get_by_id(self, artist_id: uuid.UUID) -> Artist | None:
        """아티스트 상세 (모든 관계 eager load)"""
        return self.db.scalar(
            select(Artist)
            .options(
                joinedload(Artist.genres),
                joinedload(Artist.albums).joinedload(Album.tracks),
                joinedload(Artist.audio_features),
            )
            .where(Artist.id == artist_id)
        )

    def get_genres_with_count(self) -> list[tuple[Genre, int]]:
        """장르 목록 + 각 장르의 아티스트 수"""
        result = self.db.execute(
            select(Genre, func.count(artist_genres.c.artist_id).label("artist_count"))
            .outerjoin(artist_genres, Genre.id == artist_genres.c.genre_id)
            .group_by(Genre.id)
            .order_by(func.count(artist_genres.c.artist_id).desc())
        ).all()
        return result
