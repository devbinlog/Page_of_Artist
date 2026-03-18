# API Specification

Base URL: `http://localhost:3001`

---

## Artist API

### GET /api/artists

전체 아티스트 목록 반환.

**Response 200**
```json
[
  {
    "id": "greenday",
    "name": "Green Day",
    "imageUrl": "https://...",
    "description": "Punk rock legends from Oakland, CA.",
    "genres": ["punk rock", "alternative rock", "pop punk"],
    "spotifyUrl": "https://open.spotify.com/artist/...",
    "instagramUrl": "https://www.instagram.com/greenday",
    "featuredAlbum": {
      "id": "greenday-ai",
      "name": "American Idiot",
      "imageUrl": "https://...",
      "tracks": [
        { "number": 1, "name": "American Idiot" },
        { "number": 2, "name": "Jesus of Suburbia" }
      ]
    },
    "featuredTrack": {
      "name": "Boulevard of Broken Dreams",
      "youtubeUrl": "https://www.youtube.com/watch?v=..."
    },
    "albumYoutubeUrl": "https://www.youtube.com/watch?v=..."
  }
]
```

---

### GET /api/artists/:id

단일 아티스트 반환.

**Params**
- `id` (string): 아티스트 ID

**Response 200**: Artist 객체 (위와 동일)

**Response 404**
```json
{ "error": "Artist not found" }
```

---

### POST /api/artists

신규 아티스트 등록 (Firestore 저장).

**Body**
```json
{
  "name": "string (required)",
  "genres": ["string"],
  "imageUrl": "string",
  "description": "string",
  "spotifyUrl": "string",
  "instagramUrl": "string",
  "featuredAlbum": { "name": "string", "imageUrl": "string", "tracks": [] },
  "featuredTrack": { "name": "string", "youtubeUrl": "string" },
  "albumYoutubeUrl": "string"
}
```

**Response 201**
```json
{ "id": "firestore-doc-id", "message": "Artist submitted for review" }
```

**Response 400**
```json
{ "error": "name and genres are required" }
```

---

## Genre API

### GET /api/genres

사용 중인 장르 목록과 각 장르의 아티스트 수 반환.

**Response 200**
```json
[
  { "genre": "pop",         "count": 8 },
  { "genre": "punk rock",   "count": 4 },
  { "genre": "indie pop",   "count": 6 }
]
```

---

### GET /api/genres/:genre/artists

특정 장르의 아티스트 목록 반환.

**Params**
- `genre` (string): 장르명 (예: `pop`, `rock`)

**Response 200**: Artist[] (부분 일치 필터링)

---

## Admin API

> 모든 Admin 엔드포인트는 `Authorization: Bearer {ADMIN_PASSWORD}` 헤더 필요.

### GET /api/admin/pending-artists

승인 대기 중인 아티스트 목록 (approved: false).

**Response 200**
```json
[
  {
    "id": "firestore-doc-id",
    "name": "New Artist",
    "genres": ["indie"],
    "createdAt": "2024-06-01T00:00:00Z",
    "approved": false
  }
]
```

---

### PATCH /api/admin/approve/:id

아티스트 승인 처리.

**Params**
- `id` (string): Firestore 문서 ID

**Response 200**
```json
{ "message": "Artist approved", "id": "firestore-doc-id" }
```

---

### DELETE /api/admin/reject/:id

아티스트 거부 및 삭제.

**Params**
- `id` (string): Firestore 문서 ID

**Response 200**
```json
{ "message": "Artist rejected and removed" }
```

---

## Spotify API (Internal)

프론트엔드에서 직접 호출하지 않음. 백엔드 내부 서비스.

### GET /api/spotify/artist/:spotifyId

Spotify 아티스트 데이터 fetch (백엔드 내부용).

---

## Health Check

### GET /api/health

**Response 200**
```json
{ "status": "ok", "timestamp": "2024-06-01T00:00:00.000Z" }
```

---

## 에러 형식

모든 에러 응답은 동일한 형식:

```json
{
  "error": "에러 메시지",
  "code": "ERROR_CODE (선택적)"
}
```

| HTTP Status | 의미 |
|-------------|------|
| 400 | 잘못된 요청 (유효성 실패) |
| 401 | 인증 필요 (Admin API) |
| 404 | 리소스 없음 |
| 500 | 서버 내부 오류 |
