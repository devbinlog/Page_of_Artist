"""
Spotify → PostgreSQL 동기화 스크립트.

실행:
    cd backend
    python -m scripts.sync_spotify

파이프라인:
    SPOTIFY_IDS (manual_data.py)
        → Spotify API (artist + top_tracks + audio_features + albums + tracks)
        + MANUAL_DATA (youtube_url, instagram_url, introduction)
            → PostgreSQL UPSERT
"""

import sys
import os
import time
import base64
from datetime import date, datetime
from pathlib import Path

import httpx
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# backend/ 루트를 Python 경로에 추가
sys.path.insert(0, str(Path(__file__).parent.parent))

load_dotenv()

from app.database import SessionLocal, engine
from app.models import Artist, Genre, Album, Track, AudioFeatures
from app.database import Base
from scripts.manual_data import SPOTIFY_IDS, MANUAL_DATA

# ── Spotify 인증 ───────────────────────────────────────────
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_BASE      = "https://api.spotify.com/v1"

_token_cache: dict = {}


def get_token() -> str:
    if _token_cache.get("expires_at", 0) > time.time() + 60:
        return _token_cache["token"]

    client_id     = os.environ["SPOTIFY_CLIENT_ID"]
    client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]
    credentials   = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()

    r = httpx.post(
        SPOTIFY_TOKEN_URL,
        headers={"Authorization": f"Basic {credentials}",
                 "Content-Type": "application/x-www-form-urlencoded"},
        data={"grant_type": "client_credentials"},
    )
    r.raise_for_status()
    data = r.json()

    _token_cache["token"]      = data["access_token"]
    _token_cache["expires_at"] = time.time() + data["expires_in"]
    return _token_cache["token"]


def spotify_get(path: str) -> dict:
    token = get_token()
    url   = path if path.startswith("http") else f"{SPOTIFY_BASE}{path}"
    r     = httpx.get(url, headers={"Authorization": f"Bearer {token}"})
    r.raise_for_status()
    return r.json()


# ── DB 헬퍼 ────────────────────────────────────────────────
def get_or_create_genre(db: Session, name: str) -> Genre:
    genre = db.query(Genre).filter_by(name=name).first()
    if not genre:
        genre = Genre(name=name)
        db.add(genre)
        db.flush()
    return genre


def upsert_artist(db: Session, spotify_id: str) -> bool:
    """단일 아티스트를 Spotify에서 가져와 DB에 UPSERT"""
    manual = MANUAL_DATA.get(spotify_id, {})

    print(f"  → Fetching artist {spotify_id}...")

    # 1. 아티스트 기본 정보
    artist_data = spotify_get(f"/artists/{spotify_id}")
    image_url   = artist_data["images"][0]["url"] if artist_data["images"] else None
    genres_raw  = artist_data["genres"][:3]

    # 2. 기존 레코드 조회 또는 신규 생성
    artist = db.query(Artist).filter_by(spotify_id=spotify_id).first()
    if not artist:
        artist = Artist(spotify_id=spotify_id)
        db.add(artist)

    artist.name             = artist_data["name"]
    artist.image_url        = image_url
    artist.spotify_url      = artist_data["external_urls"]["spotify"]
    artist.introduction     = manual.get("introduction")
    artist.youtube_url      = manual.get("youtube_url")
    artist.album_youtube_url= manual.get("album_youtube_url")
    artist.instagram_url    = manual.get("instagram_url")
    artist.updated_at       = datetime.utcnow()

    # 3. 장르 연결
    artist.genres.clear()
    for genre_name in genres_raw:
        genre = get_or_create_genre(db, genre_name)
        artist.genres.append(genre)

    db.flush()

    # 4. 오디오 피처 (대표 트랙 기준)
    try:
        top_tracks = spotify_get(f"/artists/{spotify_id}/top-tracks?market=KR")
        if top_tracks["tracks"]:
            track_id = top_tracks["tracks"][0]["id"]
            af_data  = spotify_get(f"/audio-features/{track_id}")

            af = db.query(AudioFeatures).filter_by(artist_id=artist.id).first()
            if not af:
                af = AudioFeatures(artist_id=artist.id)
                db.add(af)

            af.energy        = af_data.get("energy", 0.5)
            af.valence       = af_data.get("valence", 0.5)
            af.tempo         = af_data.get("tempo", 120.0)
            af.danceability  = af_data.get("danceability", 0.5)
            af.fetched_at    = datetime.utcnow()
    except Exception as e:
        print(f"    ⚠ Audio features fetch failed: {e}")

    # 5. 대표 앨범 + 트랙
    try:
        albums_data = spotify_get(
            f"/artists/{spotify_id}/albums"
            f"?include_groups=album&limit=5&market=KR"
        )
        if albums_data["items"]:
            album_raw     = albums_data["items"][0]
            album_detail  = spotify_get(f"/albums/{album_raw['id']}")
            album_image   = album_raw["images"][0]["url"] if album_raw["images"] else None

            # 기존 featured 앨범 is_featured 해제
            db.query(Album).filter_by(
                artist_id=artist.id, is_featured=True
            ).update({"is_featured": False})

            album = db.query(Album).filter_by(spotify_id=album_raw["id"]).first()
            if not album:
                album = Album(artist_id=artist.id, spotify_id=album_raw["id"])
                db.add(album)

            album.name        = album_raw["name"]
            album.image_url   = album_image
            album.is_featured = True
            try:
                album.release_date = date.fromisoformat(album_raw["release_date"])
            except ValueError:
                album.release_date = None

            db.flush()

            # 트랙 동기화
            existing_ids = {
                t.spotify_id
                for t in db.query(Track).filter_by(album_id=album.id).all()
            }
            track_items = album_detail.get("tracks", {}).get("items", [])

            for item in track_items[:20]:
                if item["id"] not in existing_ids:
                    track = Track(
                        album_id=album.id,
                        spotify_id=item["id"],
                        name=item["name"],
                        track_number=item["track_number"],
                        duration_ms=item.get("duration_ms"),
                        is_featured=(item["track_number"] == 1),
                    )
                    db.add(track)
    except Exception as e:
        print(f"    ⚠ Album/Track fetch failed: {e}")

    return True


# ── 메인 ───────────────────────────────────────────────────
def main():
    print("=== Page of Artist — Spotify Sync ===\n")

    # 테이블 없으면 생성
    Base.metadata.create_all(bind=engine)
    print("✓ Tables ready\n")

    db = SessionLocal()
    success = 0
    failed  = []

    try:
        for i, spotify_id in enumerate(SPOTIFY_IDS, 1):
            print(f"[{i:02d}/{len(SPOTIFY_IDS)}] {spotify_id}")
            try:
                upsert_artist(db, spotify_id)
                db.commit()
                print(f"    ✓ Done")
                success += 1
            except Exception as e:
                db.rollback()
                print(f"    ✗ Failed: {e}")
                failed.append(spotify_id)

            # Spotify API 레이트 리밋 방지 (권장: 0.5초 간격)
            time.sleep(0.5)

    finally:
        db.close()

    print(f"\n=== Sync complete ===")
    print(f"✓ Success: {success}/{len(SPOTIFY_IDS)}")
    if failed:
        print(f"✗ Failed:  {', '.join(failed)}")


if __name__ == "__main__":
    main()
