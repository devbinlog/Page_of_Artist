# Backend Architecture

## 개요

Express.js 기반 REST API 서버.
Spotify Web API를 래핑하여 아티스트 데이터를 제공한다.
Firebase Firestore와는 프론트엔드가 직접 통신하므로 백엔드는 Spotify 연동에 집중한다.

---

## 기술 스택

| 기술 | 역할 |
|------|------|
| Node.js | 런타임 |
| Express.js | HTTP 서버 |
| TypeScript | 타입 안전성 |
| Spotify Web API | 아티스트 데이터 소스 |
| dotenv | 환경변수 관리 |

---

## 서버 구조

```
server/src/
├── server.ts                   # Express 설정 + 미들웨어 + 라우터 등록
│
├── modules/
│   ├── artist/
│   │   ├── artist.controller   # GET /api/artists, GET /api/artists/:id
│   │   ├── artist.service      # Spotify 데이터 + Manual 데이터 병합
│   │   └── artist.repository   # Spotify API 호출 래퍼
│   │
│   ├── admin/
│   │   └── admin.controller    # PATCH /api/admin/approve/:id (승인)
│   │                           # DELETE /api/admin/reject/:id (거부)
│   │
│   ├── genre/
│   │   └── genre.controller    # GET /api/genres
│   │                           # GET /api/genres/:genre/artists
│   │
│   └── spotify/
│       └── spotify.service     # Spotify Client Credentials 토큰 관리
│                               # artist search, artist detail 호출
│
└── common/
    ├── middleware/
    │   ├── errorHandler.ts     # 전역 에러 핸들러
    │   └── adminAuth.ts        # Admin 라우트 인증
    └── config.ts               # 환경변수 타입 안전하게 로드
```

---

## 실행 방법

```bash
# 개발 (프론트엔드만, 정적 데이터)
npm run dev

# 개발 (프론트 + 백엔드 동시)
npm run dev:all

# 백엔드만
cd server && npm run dev
```

---

## 환경변수

```env
# server/.env
PORT=3001
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
ADMIN_PASSWORD=your_admin_password
```

---

## Spotify 인증 방식

Client Credentials Flow (사용자 인증 불필요):

```
POST https://accounts.spotify.com/api/token
  body: grant_type=client_credentials
  header: Authorization: Basic base64(clientId:clientSecret)

응답: { access_token, token_type, expires_in }

이후 API 호출:
  header: Authorization: Bearer {access_token}
```

토큰 만료(3600초) 시 자동 재발급.

---

## 프론트-백 연동 방식

```
프론트엔드 (Vite)
  └─ /api/* 요청
       └─ vite.config.ts proxy
            └─ http://localhost:3001

프로덕션:
  └─ 동일 도메인 배포 또는 CORS 설정
```

---

## Firebase 연동

백엔드 서버는 Firebase에 직접 접근하지 않는다.
Firestore CRUD는 프론트엔드에서 Firebase SDK로 직접 처리한다.

```
아티스트 등록:    프론트 → Firestore SDK (addDoc)
갤러리 구독:      프론트 → Firestore SDK (onSnapshot)
승인 처리:        프론트(Admin) → Firestore SDK (updateDoc)
```

백엔드를 통한 Firestore 접근은 향후 서버 사이드 검증이 필요할 때 추가.
