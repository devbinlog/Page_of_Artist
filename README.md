# Page of Artist 🎵

> 아티스트의 음악 세계를 3D 공간에서 탐험하는 인터랙티브 뮤직 갤러리

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.165-black?logo=three.js)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FF6F00?logo=firebase)](https://firebase.google.com)

---

## 개요

Page of Artist는 Spring 물리 기반 3D 캐러셀로 아티스트 카드를 탐색하고, 카드를 뒤집으면 앨범 트랙리스트가 펼쳐지는 몰입형 뮤직 포트폴리오 앱입니다. 마우스 드래그·스크롤·키보드로 carousel을 회전하며 30명의 큐레이션 아티스트를 둘러볼 수 있습니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| 3D 캐러셀 | Spring 물리(tension=170, friction=26) 기반 원형 카드 배치 |
| 카드 뒤집기 | Front(아티스트 정보) ↔ Back(앨범 트랙리스트) Y축 플립 |
| 호버 틸트 | 활성 카드에 마우스 위치 기반 ±6° 3D 기울기 |
| 장르 필터 | Pop / Hip-Hop / Rock / R&B / Indie / Electronic / Latin |
| 그리드 뷰 | 3D 뷰 ↔ 카드 그리드 레이아웃 전환 |
| 로그인/회원가입 | Firebase Authentication (이메일+비밀번호) |
| 아티스트 상세 | 아티스트 페이지 → YouTube 앨범 링크, 트랙리스트 |
| 관리자 페이지 | PIN 기반 접근, 아티스트 등록 관리 |

## 빠른 시작

```bash
# 의존성 설치
npm install
cd server && npm install && cd ..

# 환경변수 설정 (선택 — 없으면 정적 데이터 사용)
cp server/.env.example server/.env
# server/.env 에 Spotify Client ID/Secret 입력

# 개발 서버 실행 (프론트 + 백엔드 동시)
npm run dev:all
```

- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:3001

## 페이지 구조

```
/               LoadingPage    — 로딩 화면
/intro          IntroPage      — 랜딩 (3D 데모 카드 + 검색)
/gallery        GalleryPage    — 3D 캐러셀 갤러리 (메인)
/artist/:id     ArtistPage     — 아티스트 상세
/auth           AuthPage       — 로그인 / 회원가입
/register       RegisterPage   — 아티스트 등록 (4단계)
/admin          AdminPage      — 관리자 (PIN 인증)
```

## 기술 스택

- **프론트**: React 18 + TypeScript + Vite
- **3D 렌더링**: Three.js 0.165 + @react-three/fiber 8 + @react-three/drei 9
- **상태관리**: Zustand 4
- **데이터베이스**: Firebase Firestore
- **인증**: Firebase Authentication
- **백엔드**: Node.js + Express + TypeScript (tsx)
- **외부 API**: Spotify Web API (옵션)

## 문서

| 문서 | 내용 |
|------|------|
| [FRONTEND.md](docs/FRONTEND.md) | 프론트엔드 아키텍처, 컴포넌트 구조 |
| [BACKEND.md](docs/BACKEND.md) | 백엔드 API, Spotify 연동 |
| [DATABASE.md](docs/DATABASE.md) | Firebase Firestore 스키마, 인증 |
| [THREEJS.md](docs/THREEJS.md) | 3D 캐러셀, 카드 애니메이션 구현 |

---

> Made with React Three Fiber · Designed for music lovers
