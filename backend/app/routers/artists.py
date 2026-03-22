import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.artist_service import ArtistService
from app.schemas.artist import ArtistListResponse, ArtistDetailResponse
from app.schemas.genre import GenreListResponse

router = APIRouter(prefix="/artists", tags=["artists"])


@router.get("", response_model=ArtistListResponse)
def get_artist_list(
    genre: str | None = Query(None, description="장르 필터 (예: indie pop)"),
    mood: str | None = Query(None, description="mood 태그 필터 (예: dreamy)"),
    limit: int = Query(20, ge=1, le=50),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """
    아티스트 목록 조회.
    GalleryPage CircularCarousel 초기 로드에 사용.
    """
    service = ArtistService(db)
    return service.get_artist_list(genre=genre, limit=limit, offset=offset)


@router.get("/genres", response_model=GenreListResponse)
def get_genre_list(db: Session = Depends(get_db)):
    """
    장르 목록 + 아티스트 수.
    IntroPage 검색 필터 버튼에 사용.
    """
    service = ArtistService(db)
    return service.get_genre_list()


@router.get("/{artist_id}", response_model=ArtistDetailResponse)
def get_artist_detail(
    artist_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    """
    아티스트 상세 조회.
    ArtistPage 진입 시 CardFront / CardBack / LinkCube 데이터 로드.
    """
    service = ArtistService(db)
    return service.get_artist_detail(artist_id)
