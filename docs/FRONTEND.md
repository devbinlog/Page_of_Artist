# Frontend Architecture

## 기술 스택

| 라이브러리 | 버전 | 용도 |
|------------|------|------|
| React | 18.3 | UI 컴포넌트 |
| TypeScript | 5.4 | 타입 안전성 |
| Vite | 5.3 | 번들러 / 개발 서버 |
| React Router DOM | 7.x | SPA 라우팅 |
| Zustand | 4.5 | 전역 상태 관리 |
| Firebase SDK | 12.x | Firestore + Auth |

## 폴더 구조

```
src/
├── App.tsx                  # 라우터 루트
├── main.tsx                 # React DOM 진입점
│
├── pages/                   # 라우트별 페이지
│   ├── LoadingPage.tsx      # 초기 로딩 화면
│   ├── IntroPage.tsx        # 랜딩 (3D 데모 카드)
│   ├── GalleryPage.tsx      # 3D 캐러셀 갤러리 (메인)
│   ├── ArtistPage.tsx       # 아티스트 상세
│   ├── AuthPage.tsx         # 로그인 / 회원가입
│   ├── RegisterPage.tsx     # 아티스트 등록 (4단계)
│   └── AdminPage.tsx        # 관리자 페이지
│
├── components/
│   ├── card/                # 상세 페이지용 카드
│   │   ├── ArtistCard.tsx   # 카드 래퍼 (flip 제어)
│   │   ├── CardFront.tsx    # 카드 앞면 (아티스트 정보)
│   │   ├── CardBack.tsx     # 카드 뒷면 (앨범 트랙리스트)
│   │   └── CardParallax.tsx # 마우스 패럴랙스 효과
│   ├── carousel/            # 갤러리 3D 캐러셀
│   │   ├── CircularCarousel.tsx  # Spring 물리 캐러셀
│   │   └── GalleryCard.tsx       # 갤러리용 미니 카드
│   ├── navigation/
│   │   └── NavBar.tsx       # 상단 네비게이션
│   ├── scene/               # Three.js 씬 요소
│   │   ├── SceneBackground.tsx   # 그라디언트 배경
│   │   ├── AmbientParticles.tsx  # 떠다니는 파티클
│   │   ├── StaffLines.tsx        # 악보 줄 장식
│   │   ├── FloorRing.tsx         # 캐러셀 하단 링
│   │   └── ExhibitionCamera.tsx  # 카메라 제어
│   ├── transition/
│   │   └── ZoomTransition.tsx    # 페이지 전환 효과
│   ├── cube/
│   │   └── LinkCube.tsx     # 링크 3D 큐브
│   └── vinyl/
│       └── VinylRecord.tsx  # 바이닐 레코드 3D 오브젝트
│
├── hooks/
│   ├── useAuth.ts           # Firebase Auth 상태 구독
│   ├── useFirestoreArtists.ts # Firestore 아티스트 실시간 로드
│   ├── useSpotify.ts        # Spotify API 오케스트레이션
│   ├── useTextureSafe.ts    # Three.js 텍스처 안전 로드
│   ├── useGyroscope.ts      # 모바일 자이로스코프
│   ├── useMouseTilt.ts      # 마우스 3D 틸트
│   └── useSwipe.ts          # 터치 스와이프
│
├── store/
│   └── useStore.ts          # Zustand 전역 상태
│
├── services/
│   ├── artistService.ts     # API 호출 + fallback
│   └── apiClient.ts         # Axios/fetch 기반 HTTP 클라이언트
│
├── lib/
│   └── firebase.ts          # Firebase 초기화 (app, db, auth)
│
├── data/
│   └── staticArtists.ts     # 30명 큐레이션 정적 데이터
│
├── types/
│   └── artist.ts            # Artist, Track, Album 타입
│
├── styles/
│   └── tokens.ts            # 디자인 토큰 (colors, radius, shadow 등)
│
└── utils/
    ├── cameraState.ts       # 드래그 상태 싱글턴
    ├── colorExtract.ts      # 앨범 대표 색상 추출
    └── navigationService.ts # React 외부에서 navigate() 사용
```

## 전역 상태 (Zustand)

```ts
// src/store/useStore.ts
interface AppStore {
  artists:           Artist[]         // 로드된 아티스트 목록
  selectedArtist:    Artist | null    // 상세 페이지 대상
  isLoading:         boolean
  loadingProgress:   number           // 0–100
  searchQuery:       string
  genreFilter:       string
  isTransitioning:   boolean
  currentUser:       FirebaseUser | null  // 로그인 사용자

  // Actions
  setArtists(a: Artist[]): void
  setSelectedArtist(a: Artist | null): void
  setGenreFilter(g: string): void
  setCurrentUser(u: FirebaseUser | null): void
  // ...
}
```

## 라우팅

```tsx
// App.tsx
<Routes>
  <Route path="/"           element={<LoadingPage />} />
  <Route path="/intro"      element={<IntroPage />} />
  <Route path="/gallery"    element={<GalleryPage />} />
  <Route path="/artist/:id" element={<ArtistPage />} />
  <Route path="/auth"       element={<AuthPage />} />
  <Route path="/register"   element={<RegisterPage />} />
  <Route path="/admin"      element={<AdminPage />} />
</Routes>
```

## 디자인 토큰

`src/styles/tokens.ts`에 모든 색상, 반경, 그림자 정의.

```ts
colors.brand        // #4F7DF3 (브랜드 블루)
colors.brandPurple  // #7B5EA7
colors.textPrimary  // #0d1f4a
colors.bgWhite      // #FFFFFF
colors.bgLight      // #F4F7FF
colors.gradientBrand // linear-gradient(135deg, #4F7DF3 → #7B5EA7)
```

## 폰트 (public/)

| 파일 | 용도 | 주의 |
|------|------|------|
| Playfair-Bold.ttf | 아티스트 이름 (디스플레이) | TTF만 사용 (WOFF2 사용 시 troika crash) |
| Montserrat-SemiBold.ttf | 레이블, 장르 뱃지 | TTF만 사용 |
| Montserrat-Regular.ttf | 본문, 트랙명 | TTF만 사용 |
| Inter-Regular.ttf | 기본 fallback | - |

> **중요**: `<Text font="...woff2">` 는 troika-three-text crash를 유발합니다. 반드시 `.ttf` 사용.
