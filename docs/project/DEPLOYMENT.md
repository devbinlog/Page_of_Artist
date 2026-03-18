# Deployment Guide

## 아키텍처 옵션

### Option A — 프론트엔드만 (정적 배포, 권장)
```
Vercel / Netlify / GitHub Pages
  └─ 정적 빌드 (npm run build)
  └─ Firebase SDK 직접 연결
  └─ Spotify API 없이 staticArtists 동작
```

### Option B — 풀스택
```
프론트엔드: Vercel
백엔드:     Railway / Render / Fly.io
DB:         Firebase Firestore (GCP)
```

---

## 프론트엔드 배포 (Vercel)

```bash
# 빌드 커맨드
npm run build

# 출력 디렉토리
dist/

# 환경변수 (Vercel 대시보드에 설정)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

SPA 라우팅을 위한 `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 백엔드 배포 (Railway)

```bash
# 빌드 커맨드
cd server && npm run build

# 시작 커맨드
node dist/server.js

# 환경변수
PORT=3001
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
ADMIN_PASSWORD=
```

---

## Firebase 설정

### 1. Firestore 생성
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 새 프로젝트 생성
3. Firestore Database → 프로덕션 모드로 생성

### 2. 보안 규칙 배포
```bash
firebase deploy --only firestore:rules
```

### 3. 웹 앱 등록
프로젝트 설정 → 앱 추가 → 웹 → SDK 값을 `.env.local`에 복사

---

## 로컬 개발 실행

```bash
# 1. 의존성 설치
npm install
cd server && npm install && cd ..

# 2. 환경변수 설정
cp .env.example .env.local
# Firebase / Spotify 키 입력

# 3-a. 프론트엔드만 (정적 데이터)
npm run dev

# 3-b. 풀스택 (Spotify API 포함)
npm run dev:all
```

---

## 환경변수 파일 구조

```
프론트엔드:
  .env.local          로컬 개발 (gitignore)
  .env.example        템플릿 (git에 포함)

백엔드:
  server/.env         로컬 개발 (gitignore)
  server/.env.example 템플릿 (git에 포함)
```
