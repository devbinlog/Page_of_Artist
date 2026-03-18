# Backend Architecture

## 개요

Node.js + Express + TypeScript 기반 REST API 서버.
Spotify Web API에서 아티스트 데이터를 가져오며, 자격 증명이 없으면 자동으로 정적 데이터로 폴백합니다.

## 기술 스택

| 라이브러리 | 용도 |
|------------|------|
| Express 4 | HTTP 서버 |
| TypeScript | 타입 안전성 |
| tsx (watch) | TS 직접 실행 + HMR |
| node-fetch | Spotify API HTTP 요청 |

## 폴더 구조

```
server/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # 서버 진입점, 라우트 등록
    ├── routes/
    │   ├── artists.ts        # GET /api/artists, /api/artists/genres
    │   └── artist.ts         # GET /api/artist/:id
    ├── services/
    │   └── artistService.ts  # getArtists(), getArtistById(), getGenres()
    ├── spotify/
    │   ├── auth.ts           # Client Credentials 토큰 발급 + 갱신
    │   └── client.ts         # Spotify API 호출 함수
    ├── transform/
    │   └── spotifyToArtist.ts # Spotify 응답 → Artist 타입 변환
    ├── data/
    │   └── staticArtists.ts  # 30명 큐레이션 정적 데이터 (fallback)
    └── types/
        └── spotify.ts        # Spotify API 응답 타입
```

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| GET | `/api/artists` | 아티스트 전체 목록 |
| GET | `/api/artists/genres` | 장르 목록 |
| GET | `/api/artist/:id` | 단일 아티스트 상세 |

### 응답 예시 — GET /api/artists

```json
[
  {
    "id": "spotify:artist:...",
    "name": "The Weeknd",
    "genres": ["pop", "r&b"],
    "imageUrl": "https://i.scdn.co/...",
    "description": "...",
    "featuredTrack": { "name": "Blinding Lights", "previewUrl": "..." },
    "featuredAlbum": {
      "name": "After Hours",
      "imageUrl": "https://i.scdn.co/...",
      "tracks": [
        { "number": 1, "name": "Alone Again", "durationMs": 235213 }
      ]
    }
  }
]
```

## Spotify 인증 흐름

```
1. 서버 시작 → getAccessToken() 호출
   - POST https://accounts.spotify.com/api/token
   - Body: grant_type=client_credentials
   - Header: Authorization: Basic base64(CLIENT_ID:CLIENT_SECRET)

2. 응답: { access_token, expires_in: 3600 }

3. 3600초마다 자동 갱신 (setInterval)

4. 모든 Spotify API 호출에 Bearer 토큰 첨부
```

## 환경변수

```bash
# server/.env (server/.env.example 참고)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
PORT=3001
```

> 환경변수 미설정 시 경고 출력 후 정적 데이터(staticArtists.ts)로 폴백.

## 개발 서버 실행

```bash
cd server
npm run dev          # tsx watch src/index.ts → http://localhost:3001

# 또는 루트에서 전체 실행
npm run dev:all      # 프론트 + 백엔드 동시 (concurrently)
```

## Spotify 개발자 설정

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) 접속
2. 새 앱 생성
3. Client ID, Client Secret 복사
4. `server/.env`에 붙여넣기
