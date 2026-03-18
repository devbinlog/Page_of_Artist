# Frontend

## 기술 스택

| 라이브러리 | 버전 | 역할 |
|------------|------|------|
| React | 18.3 | UI 컴포넌트 트리 |
| TypeScript | 5.4 | 정적 타입 검사 |
| Vite | 5.3 | 번들러, HMR 개발 서버 |
| React Router DOM | 7.x | SPA 클라이언트 라우팅 |
| Zustand | 4.5 | 전역 상태 관리 |
| Firebase SDK | 12.x | Firestore 실시간 DB + Auth |

---

## 폴더 구조

```
src/
├── App.tsx                       라우터 루트, 전체 라우트 선언
├── main.tsx                      React DOM 진입점
│
├── pages/                        라우트 단위 페이지 컴포넌트
│   ├── LoadingPage.tsx           최초 진입 로딩 화면
│   ├── IntroPage.tsx             랜딩 — 3D 데모 카드, 아티스트 검색
│   ├── GalleryPage.tsx           메인 — Spring 물리 3D 캐러셀 갤러리
│   ├── ArtistPage.tsx            아티스트 상세 — 앨범, 트랙리스트, 링크
│   ├── AuthPage.tsx              로그인 / 회원가입 탭 전환
│   ├── RegisterPage.tsx          아티스트 등록 — 4단계 멀티스텝 폼
│   └── AdminPage.tsx             관리자 — PIN 인증 접근
│
├── components/
│   ├── card/                     아티스트 상세 페이지용 3D 카드
│   │   ├── ArtistCard.tsx        카드 래퍼 — flip 상태 관리, 패럴랙스 적용
│   │   ├── CardFront.tsx         카드 앞면 — 아티스트 사진, 이름, 장르, 대표곡
│   │   ├── CardBack.tsx          카드 뒷면 — 앨범 아트, 트랙리스트, YouTube 버튼
│   │   └── CardParallax.tsx      마우스 오프셋 기반 3D 패럴랙스 레이어
│   │
│   ├── carousel/                 갤러리 3D 캐러셀 시스템
│   │   ├── CircularCarousel.tsx  Spring 물리 캐러셀 — 위치 계산, 입력 처리
│   │   └── GalleryCard.tsx       캐러셀용 미니 카드 — 상태별 scale/glow/flip
│   │
│   ├── navigation/
│   │   └── NavBar.tsx            상단 네비게이션 — 로그인 상태 반영
│   │
│   ├── scene/                    Three.js 씬 배경 요소
│   │   ├── SceneBackground.tsx   그라디언트 배경 메시
│   │   ├── AmbientParticles.tsx  부유하는 파티클 (useFrame 기반)
│   │   ├── StaffLines.tsx        악보 오선지 수평선 장식
│   │   ├── FloorRing.tsx         캐러셀 하단 발광 링 (opacity pulse)
│   │   └── ExhibitionCamera.tsx  카메라 제어 컴포넌트
│   │
│   ├── transition/
│   │   └── ZoomTransition.tsx    페이지 전환 줌 이펙트
│   │
│   ├── cube/
│   │   └── LinkCube.tsx          외부 링크용 3D 큐브 오브젝트
│   │
│   └── vinyl/
│       └── VinylRecord.tsx       바이닐 레코드 3D 오브젝트
│
├── hooks/
│   ├── useAuth.ts                onAuthStateChanged 구독 — 앱 시작 시 로그인 상태 복원
│   ├── useFirestoreArtists.ts    Firestore onSnapshot 구독 — artists 컬렉션 실시간 로드
│   ├── useSpotify.ts             Spotify API 데이터 페칭 + 정적 fallback 오케스트레이션
│   ├── useTextureSafe.ts         Three.js 텍스처 비동기 로드 (cancelled flag 패턴)
│   ├── useGyroscope.ts           모바일 DeviceOrientation 이벤트 처리
│   ├── useMouseTilt.ts           마우스 위치 기반 3D 틸트 각도 계산
│   └── useSwipe.ts               터치 스와이프 방향 감지
│
├── store/
│   └── useStore.ts               Zustand 전역 스토어 (아래 참고)
│
├── services/
│   ├── artistService.ts          백엔드 API 호출 함수, 정적 데이터 fallback 처리
│   └── apiClient.ts              fetch 기반 HTTP 클라이언트, 에러 핸들링 래퍼
│
├── lib/
│   └── firebase.ts               Firebase 앱 초기화 — app, db, auth export
│
├── data/
│   └── staticArtists.ts          30명 큐레이션 아티스트 정적 데이터셋
│
├── types/
│   └── artist.ts                 Artist, Track, Album, FeaturedTrack 타입 정의
│
├── styles/
│   └── tokens.ts                 디자인 토큰 — 색상, 반경, 그림자, 버튼 스타일
│
└── utils/
    ├── cameraState.ts            드래그 중 클릭 이벤트 차단용 싱글턴 상태
    ├── colorExtract.ts           이미지에서 대표 색상 추출 (Canvas API)
    └── navigationService.ts      React 컴포넌트 외부에서 navigate() 호출 가능한 싱글턴
```

---

## 전역 상태 (Zustand)

`src/store/useStore.ts`

```ts
interface AppStore {
  // 데이터
  artists:         Artist[]          // Firestore에서 실시간 로드된 아티스트 목록
  selectedArtist:  Artist | null     // 상세 페이지로 전달할 선택된 아티스트

  // 로딩
  isLoading:       boolean
  loadingProgress: number            // 0 ~ 100, 로딩바 진행률

  // 검색 / 필터
  searchQuery:     string
  genreFilter:     string            // 빈 문자열 = 전체, 값 = 특정 장르

  // 전환
  isTransitioning: boolean           // 페이지 전환 애니메이션 중 플래그

  // 인증
  currentUser: FirebaseUser | null   // Firebase Auth 현재 사용자
}
```

Zustand는 `(prev) =>` 형태의 함수형 업데이트를 지원하지 않으므로,
setter 내부에서 스토어 값을 직접 변수에 담아 처리했습니다.

---

## 라우팅 구조

```tsx
// src/App.tsx
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

LoadingPage → IntroPage → GalleryPage 로 이어지는 단방향 진입 흐름을 가지며,
ArtistPage는 GalleryPage 또는 GridView 어디서든 진입 가능합니다.

---

## 컴포넌트 설계 원칙

### React state vs ref 분리

Three.js 씬에서 매 프레임 갱신되는 값(위치, 회전, 스케일, opacity)은 모두 useRef에 저장하고
useFrame에서 직접 Three.js 오브젝트에 적용합니다.
React state는 UI 조건 렌더링(앞면/뒷면 전환 등)이 필요한 경우에만 사용합니다.

```ts
// 잘못된 방식 — 매 프레임 React 리렌더링 유발
const [rotation, setRotation] = useState(0)
useFrame(() => setRotation(r => r + 0.01))

// 올바른 방식 — Three.js 오브젝트 직접 조작
const meshRef = useRef<THREE.Mesh>(null)
useFrame(() => {
  if (meshRef.current) meshRef.current.rotation.y += 0.01
})
```

### 이벤트 처리 구조

캐러셀 드래그/클릭 이벤트는 Three.js Canvas의 DOM 이벤트로 처리합니다.
드래그 후 발생하는 click 이벤트를 차단하기 위해 `cameraDragState` 싱글턴으로
드래그 여부를 공유합니다.

```ts
// src/utils/cameraState.ts
export const cameraDragState = { hasDragged: false }

// CircularCarousel — 드래그 완료 후 100ms 후 초기화
setTimeout(() => { cameraDragState.hasDragged = false }, 100)

// GalleryCard — 클릭 이벤트에서 드래그 여부 확인
onClick={() => {
  if (cameraDragState.hasDragged) return
  if (dist !== 0) goToIndex(i)
}}
```

---

## 디자인 토큰

`src/styles/tokens.ts` 에서 모든 시각 속성을 중앙 관리합니다.

```ts
colors.brand         = '#4F7DF3'     // 브랜드 블루
colors.brandPurple   = '#7B5EA7'     // 브랜드 퍼플
colors.textPrimary   = '#0d1f4a'     // 본문 텍스트
colors.textSecondary = '#3B5080'     // 보조 텍스트
colors.bgWhite       = '#FFFFFF'
colors.bgLight       = '#F4F7FF'     // 연한 배경
colors.gradientBrand = 'linear-gradient(135deg, #4F7DF3 0%, #7B5EA7 100%)'
```

---

## 폰트 사용 규칙

drei의 `<Text>` 컴포넌트는 내부적으로 troika-three-text를 사용합니다.
WOFF2 서브셋 폰트를 로드하면 파싱 실패로 React 트리 전체가 unmount되는 silent crash가 발생합니다.
반드시 TTF 전체 폰트 파일을 사용해야 합니다.

| 파일 | 역할 |
|------|------|
| Playfair-Bold.ttf | 아티스트 이름 등 디스플레이용 세리프 폰트 |
| Montserrat-SemiBold.ttf | 레이블, 장르 뱃지, 버튼 텍스트 |
| Montserrat-Regular.ttf | 트랙명, 본문 설명 |
| Inter-Regular.ttf | HTML UI 기본 fallback |
