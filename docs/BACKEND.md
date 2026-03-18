# Backend

## 개요

Node.js + Express + TypeScript 기반 REST API 서버입니다.
Spotify Web API에서 아티스트 데이터를 가져와 앱 내부 타입으로 변환하고,
Spotify 자격 증명이 없는 환경에서는 자동으로 정적 데이터로 폴백합니다.

---

## 기술 스택

| 라이브러리 | 역할 |
|------------|------|
| Express 4 | HTTP 라우터 및 미들웨어 |
| TypeScript | 정적 타입 — Spotify 응답 타입, Artist 변환 타입 |
| tsx (watch) | TypeScript 직접 실행 + 파일 변경 감지 재시작 |
| node-fetch | Spotify API HTTP 요청 |

---

## 폴더 구조

```
server/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                    서버 진입점 — Express 앱 초기화, 라우트 등록, 환경변수 검증
    │
    ├── routes/
    │   ├── artists.ts              GET /api/artists, GET /api/artists/genres
    │   └── artist.ts               GET /api/artist/:id
    │
    ├── services/
    │   └── artistService.ts        getArtists(), getArtistById(), getGenres() — Spotify 또는 정적 데이터 분기
    │
    ├── spotify/
    │   ├── auth.ts                 Client Credentials Flow 토큰 발급 및 자동 갱신
    │   └── client.ts               Spotify Web API 호출 함수 모음
    │
    ├── transform/
    │   └── spotifyToArtist.ts      Spotify 응답 객체 → 내부 Artist 타입 변환 로직
    │
    ├── data/
    │   └── staticArtists.ts        30명 큐레이션 정적 데이터 — Spotify 없이도 동작
    │
    └── types/
        └── spotify.ts              SpotifyArtist, SpotifyAlbum, SpotifyTrack 응답 타입
```

---

## API 엔드포인트

| 메서드 | 경로 | 응답 |
|--------|------|------|
| GET | `/api/health` | `{ status: 'ok' }` |
| GET | `/api/artists` | `Artist[]` |
| GET | `/api/artists/genres` | `string[]` |
| GET | `/api/artist/:id` | `Artist` |

### 응답 예시 — GET /api/artists

```json
[
  {
    "id": "4q3ewBCX7sLwd24euuV69X",
    "name": "Bad Bunny",
    "genres": ["latin", "reggaeton", "trap latino"],
    "imageUrl": "https://i.scdn.co/image/...",
    "description": "Puerto Rican reggaeton and Latin trap artist.",
    "featuredTrack": {
      "name": "Tití Me Preguntó",
      "youtubeUrl": "https://www.youtube.com/watch?v=..."
    },
    "featuredAlbum": {
      "name": "Un Verano Sin Ti",
      "imageUrl": "https://i.scdn.co/image/...",
      "tracks": [
        { "number": 1, "name": "El Apagón" },
        { "number": 2, "name": "Tití Me Preguntó" }
      ]
    },
    "albumYoutubeUrl": "https://www.youtube.com/watch?v=..."
  }
]
```

---

## Spotify 인증 흐름

Spotify Web API는 서버 간 인증에 Client Credentials Flow를 사용합니다.

```
서버 시작
  │
  └── getAccessToken()
        POST https://accounts.spotify.com/api/token
        Authorization: Basic base64(CLIENT_ID:CLIENT_SECRET)
        Body: grant_type=client_credentials
        │
        └── 응답: { access_token, expires_in: 3600 }
              │
              ├── Bearer 토큰으로 모든 Spotify API 요청에 첨부
              └── setInterval(getAccessToken, 3500 * 1000) 으로 자동 갱신
```

---

## 데이터 변환 파이프라인

Spotify API 응답을 앱 내부 `Artist` 타입으로 변환하는 단계입니다.

```
Spotify API 응답
  │
  ├── SpotifyArtist  (id, name, genres, images[])
  ├── SpotifyAlbum   (id, name, images[], tracks.items[])
  └── SpotifyTrack   (id, name, track_number, duration_ms)
  │
  └── spotifyToArtist.ts 변환
        │
        ├── imageUrl: images 배열에서 가장 큰 이미지 선택 (width 기준 정렬)
        ├── genres:   배열 그대로 유지 (소문자)
        ├── tracks:   name, track_number, duration_ms 필드만 추출
        └── description: genres 배열을 조합해 자동 생성
        │
        └── Artist 타입 (프론트엔드와 공유)
```

---

## Fallback 전략

Spotify 자격 증명이 없거나 API 호출이 실패하는 경우 정적 데이터로 자동 폴백합니다.

```ts
// artistService.ts
async function getArtists(): Promise<Artist[]> {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.warn('[server] Spotify 미설정 — 정적 데이터 사용')
    return STATIC_ARTISTS
  }
  try {
    return await fetchFromSpotify()
  } catch (e) {
    console.error('[server] Spotify 오류 — 정적 데이터로 폴백')
    return STATIC_ARTISTS
  }
}
```

---

## 환경변수

```bash
# server/.env.example 을 복사해서 사용
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

두 값이 없으면 서버는 정상 기동하고, 요청 시마다 정적 데이터를 반환합니다.

---

## 개발 서버 실행

```bash
# 백엔드만 실행
cd server
npm run dev

# 프론트엔드 + 백엔드 동시 실행 (루트에서)
npm run dev:all
```

---

## Spotify 설정 방법

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) 에서 앱 생성
2. Client ID, Client Secret 발급
3. `server/.env` 에 두 값 입력
4. Spotify API는 서버 사이드에서만 호출 — Client Secret이 브라우저에 노출되지 않음
