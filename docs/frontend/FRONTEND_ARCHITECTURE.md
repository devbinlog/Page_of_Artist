# Frontend Architecture

## 기술 스택

| 기술 | 버전 | 역할 |
|------|------|------|
| React | 18 | UI 렌더링 |
| TypeScript | 5 | 타입 안전성 |
| Vite | 5 | 빌드 도구, 개발 서버 |
| React Router | v6 | URL 라우팅 |
| Zustand | 4 | 전역 상태 관리 |
| Three.js | r164 | 3D 렌더링 엔진 |
| React Three Fiber | 8 | Three.js React 바인딩 |
| Drei | 9 | R3F 유틸리티 컴포넌트 |
| Firebase | 10 | Firestore DB |

---

## 레이어 구조

```
┌─────────────────────────────────────────┐
│              Pages (라우트)               │
│  Loading / Intro / Gallery / Artist /    │
│  Register / Admin                        │
├─────────────────────────────────────────┤
│             Features (도메인)             │
│  artist-card / gallery /                 │
│  artist-register / admin                 │
├──────────────────┬──────────────────────┤
│  Components (UI) │   Hooks (로직)        │
│  ui / scene /    │   useTextureSafe /    │
│  vinyl / cube /  │   useFirestore /      │
│  transition      │   useTilt / useSwipe  │
├──────────────────┴──────────────────────┤
│         Services (데이터 레이어)           │
│         artistService / apiClient        │
├─────────────────────────────────────────┤
│    Store (Zustand) │  Styles (Tokens)    │
├─────────────────────────────────────────┤
│         Lib / Types / Utils              │
└─────────────────────────────────────────┘
```

---

## 라우팅

```
/               → LoadingPage    (데이터 로드)
/intro          → IntroPage      (검색 + 진입)
/gallery        → GalleryPage    (3D 캐러셀 + 장르 필터)
/artist/:id     → ArtistPage     (상세: 카드 + 비닐 + 앨범)
/register       → RegisterPage   (4단계 등록)
/admin          → AdminPage      (승인 관리)
*               → redirect /
```

---

## 상태 관리 원칙

| 상태 | 위치 | 이유 |
|------|------|------|
| artists[] | Zustand | 전체 앱에서 공유 |
| selectedArtist | Zustand | 페이지 간 유지 필요 |
| isLoading / progress | Zustand | LoadingPage ↔ NavigationSetup |
| genreFilter | Zustand | 갤러리 복귀 시 상태 유지 |
| searchQuery | Zustand | 인트로 ↔ 갤러리 연동 가능성 |
| isTransitioning | Zustand | ZoomTransition 오버레이 제어 |
| 폼 데이터 (Register) | 로컬 useState | 페이지 내부에서만 사용 |
| 카드 플립 상태 | 로컬 useRef/useState | ArtistCard 내부에서만 사용 |
| 캐러셀 인덱스 | 로컬 useRef | CircularCarousel 내부에서만 사용 |

---

## 데이터 로딩 플로우

```
App 마운트
  └─ NavigationSetup
       └─ useSpotify()
            └─ artistService.fetchArtists()
                 ├─ GET /api/artists  →  성공: Zustand 저장
                 └─ 실패: STATIC_ARTISTS  →  Zustand 저장
                      └─ navigateTo('/intro')
```

Firebase가 설정된 경우:
```
GalleryPage 마운트
  └─ useFirestoreArtists()
       └─ Firestore onSnapshot (approved=true)
            └─ Zustand artists에 신규 항목 병합
```

---

## 3D 씬 구조

각 페이지는 독립적인 `<Canvas>`를 가진다.

```
GalleryPage Canvas
  ├─ SceneBackground
  ├─ ExhibitionCamera (드래그 회전, 줌)
  ├─ MusicElements (음표 파티클)
  ├─ StaffLines (오선지 라인)
  └─ CircularCarousel
       └─ ArtistCard × N (LOD 적용)

ArtistPage Canvas
  ├─ SceneBackground
  ├─ ExhibitionCamera
  ├─ MusicElements
  ├─ StaffLines
  ├─ ArtistCard (detail 모드)
  ├─ VinylRecord
  ├─ AlbumDisplay
  └─ LinkCube × 1~3
```

---

## 성능 전략

| 항목 | 전략 |
|------|------|
| 텍스처 로딩 | `useTextureSafe`: cancelled flag로 메모리 누수 방지 |
| 캐러셀 LOD | 전면에서 ±5장만 실제 텍스처, 나머지는 BoxGeometry |
| useFrame | Three.js ref 직접 조작, setState 최소화 |
| dpr | `[1, 1.5]`로 고해상도 디스플레이 대응하되 2.0 이상 방지 |
| 재사용 벡터 | ArtistCard에서 useRef로 Vector3/Quaternion 미리 할당 |
