# Page of Artist

아티스트의 음악 세계를 3D 공간에서 탐험하는 인터랙티브 뮤직 갤러리 웹 앱입니다.

React Three Fiber 기반의 Spring 물리 캐러셀 위에 아티스트 카드를 배치하고,
드래그 · 스크롤 · 키보드로 회전하며 카드를 뒤집으면 앨범 트랙리스트가 펼쳐집니다.
Firebase Firestore로 데이터를 실시간 동기화하고, Firebase Auth로 사용자 인증을 처리합니다.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.165-black?logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FF6F00?logo=firebase&logoColor=white)

---

## 화면

### Main 3D Scene

<img width="1440" height="728" alt="스크린샷 2026-03-22 오후 4 58 09" src="https://github.com/user-attachments/assets/69c9553b-e042-4082-8f51-1527c4da9c23" />

<img width="1440" height="714" alt="스크린샷 2026-03-19 오전 2 21 03" src="https://github.com/user-attachments/assets/b419d0c3-7653-4d4c-818b-e8ddb85cd428" />

### Artist Card Interaction

<img width="1440" height="728" alt="스크린샷 2026-03-22 오후 4 57 38" src="https://github.com/user-attachments/assets/01f17559-7d9f-4e04-8b9e-2195cd826639" />
<img width="1440" height="728" alt="스크린샷 2026-03-22 오후 4 58 33" src="https://github.com/user-attachments/assets/2ef3b6f0-fa85-4e1e-ba8b-e141853621a1" />


### Artist Detail Page

<img width="1440" height="714" alt="스크린샷 2026-03-19 오전 2 20 19" src="https://github.com/user-attachments/assets/01d7c614-6ec4-44dc-bb0b-7ea6b0380713" />

### Upload Page

<img width="1440" height="714" alt="스크린샷 2026-03-19 오전 2 21 33" src="https://github.com/user-attachments/assets/6080ef49-a840-452e-8631-f0b4a187b327" />

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18.3, TypeScript 5.4, Vite 5 |
| 3D 렌더링 | Three.js 0.165, @react-three/fiber 8, @react-three/drei 9 |
| 상태 관리 | Zustand 4 |
| 데이터베이스 | Firebase Firestore |
| 인증 | Firebase Authentication |
| 백엔드 | Node.js, Express, TypeScript (tsx) · FastAPI, Python 3.12 |
| 외부 API | Spotify Web API (Client Credentials Flow) |

---

## 구현 기능

| 기능 | 설명 |
|------|------|
| 3D 캐러셀 | Spring 물리 기반 원형 카드 배치 (RADIUS=3.8, MAX_CARDS=12), 드래그 · 스크롤 · 키보드 지원 |
| 카드 플립 | 앞면(아티스트 정보) ↔ 뒷면(앨범 트랙리스트) Y축 lerp 애니메이션 |
| 호버 틸트 | 마우스 위치를 기반으로 활성 카드에 ±6° 3D 기울기 적용 (CardParallax) |
| 상태별 시각 계층 | active(1.0x) · neighbor(0.82x) · background(0.65x) scale + glow lerp |
| 장르 필터 | Pop / Hip-Hop / Rock / R&B / Indie / Electronic / Latin |
| 뷰 전환 | 3D 캐러셀 뷰 ↔ 그리드 카드 뷰 |
| 로그인 · 회원가입 | Firebase Authentication (이메일 + 비밀번호) |
| 아티스트 상세 | 앨범 정보, 트랙리스트, YouTube · Spotify · Instagram 링크 |
| 아티스트 등록 | 4단계 멀티스텝 폼, 데이터 Firestore 저장 |
| 관리자 페이지 | PIN 인증 기반 접근, 아티스트 데이터 관리 |
| 씬 연출 | FloorRing · AmbientParticles · StaffLines · SceneBackground |
| 가이드 캐릭터 | 페이지별 대화 말풍선을 표시하는 DJ 마스코트 (GuideCharacter), 카드 줌 감지 시 자동 위치 조정 |
| Spotify 연동 | Client Credentials 토큰 자동 갱신 (10분 캐시) + 정적 데이터 fallback |

---

## 시스템 구조

```
사용자
  │
  ├── React UI Layer (페이지 라우팅 / 상태 관리)
  │     ├── Zustand Store
  │     │     artists · selectedArtist · genreFilter
  │     │     currentUser · isTransitioning · loadingProgress
  │     │     isCardZoomed (ExhibitionCamera zoom 감지)
  │     └── GuideCharacter   DJ 마스코트 (말풍선 · 줌 연동 위치 조정)
  │
  ├── Three.js Rendering Layer (WebGL)
  │     ├── CircularCarousel     Spring 물리 캐러셀 (useFrame ref-only)
  │     ├── GalleryCard          3D 카드 오브젝트 (플립 · 스케일 · glow lerp)
  │     │     ├── CardFront      아티스트 이미지 · 이름 · 트랙 정보
  │     │     ├── CardBack       앨범 트랙리스트
  │     │     └── CardParallax  호버 틸트 (±6°)
  │     └── 씬 구성 요소
  │           FloorRing · AmbientParticles · StaffLines · SceneBackground
  │
  ├── Firebase Layer
  │     ├── Firestore    artists 컬렉션 onSnapshot 실시간 구독
  │     └── Auth         이메일/비밀번호 로그인 · 상태 onAuthStateChanged 감지
  │
  ├── Express API Server (PORT 3001)
  │     ├── GET /api/artists          Spotify 검색 → 변환 → 10분 캐시
  │     ├── GET /api/artists/genres   정적 데이터 기준 장르 목록
  │     ├── GET /api/artist/:id       Spotify 단일 아티스트 상세
  │     └── GET /api/health           헬스체크
  │           └── Spotify 미설정 시 staticArtists 자동 fallback
  └── FastAPI Backend (Python 3.12)
        ├── POST /artists             아티스트 CRUD
        ├── GET  /artists/mood        무드 기반 아티스트 추천
        └── POST /interactions        사용자 인터랙션 로깅
```

---

## 폴더 구조

```
page-of-artist/
├── src/
│   ├── components/
│   │   ├── carousel/
│   │   │   ├── CircularCarousel.tsx   Spring 물리 캐러셀 (핵심)
│   │   │   └── GalleryCard.tsx        3D 카드 (플립 · 스케일 · glow)
│   │   ├── card/
│   │   │   ├── ArtistCard.tsx         그리드 뷰 카드
│   │   │   ├── CardBack.tsx           카드 뒷면 (트랙리스트)
│   │   │   ├── CardFront.tsx          카드 앞면
│   │   │   └── CardParallax.tsx       호버 틸트
│   │   ├── scene/
│   │   │   ├── AmbientParticles.tsx   부유 파티클
│   │   │   ├── ExhibitionCamera.tsx   카메라 제어
│   │   │   ├── FloorRing.tsx          바닥 링 장식
│   │   │   ├── MusicElements.tsx      음악 요소 장식
│   │   │   ├── SceneBackground.tsx    배경
│   │   │   └── StaffLines.tsx         오선지 라인
│   │   ├── guide/
│   │   │   ├── GuideCharacter.tsx     DJ 마스코트 (말풍선 · 줌 위치 연동)
│   │   │   └── GuideCharacter.css     애니메이션 · 반응형 스타일
│   │   ├── navigation/                네비게이션 바
│   │   ├── transition/                페이지 전환 오버레이
│   │   └── vinyl/                     바이닐 레코드 컴포넌트
│   ├── pages/
│   │   ├── LoadingPage.tsx            로딩 화면
│   │   ├── IntroPage.tsx              랜딩
│   │   ├── GalleryPage.tsx            3D 갤러리 (메인)
│   │   ├── ArtistPage.tsx             아티스트 상세
│   │   ├── AuthPage.tsx               로그인 / 회원가입
│   │   ├── RegisterPage.tsx           아티스트 등록
│   │   └── AdminPage.tsx              관리자
│   ├── store/
│   │   └── useStore.ts                Zustand 전역 상태
│   ├── hooks/
│   │   ├── useTextureSafe.ts          cancelled flag 텍스처 로더
│   │   └── useGuideDialogue.ts        페이지별 가이드 대화 상태 관리
│   ├── services/                      Firebase Firestore 서비스
│   ├── lib/                           Firebase 초기화
│   └── types/
│       └── artist.ts                  Artist 도메인 타입
├── backend/                           FastAPI Python 백엔드
│   ├── app/
│   │   ├── models/                    SQLAlchemy ORM 모델
│   │   ├── routers/                   API 라우터 (artists · interactions)
│   │   ├── services/                  비즈니스 로직 (mood · log · artist)
│   │   └── schemas/                   Pydantic 스키마
│   ├── scripts/                       데이터 시드 · Spotify 동기화
│   ├── Dockerfile
│   └── requirements.txt
└── server/
    └── src/
        ├── index.ts                   Express 서버 진입점
        ├── routes/
        │   ├── artists.ts             GET /api/artists
        │   └── artist.ts              GET /api/artist/:id
        ├── services/
        │   └── artistService.ts       Spotify 조회 + 10분 캐시 + fallback
        ├── spotify/
        │   ├── auth.ts                Client Credentials 토큰 갱신
        │   └── client.ts              spotifyGet<T> 래퍼
        ├── transform/
        │   └── spotifyToArtist.ts     Spotify 응답 → Artist 타입 변환
        └── data/
            └── staticArtists.ts       정적 fallback 데이터
```

---

## 페이지 구조

```
/               LoadingPage      로딩 화면 (에셋 프리로드 + 진행률)
/intro          IntroPage        랜딩 (3D 데모 카드 + 아티스트 검색)
/gallery        GalleryPage      3D 캐러셀 갤러리 (메인)
/artist/:id     ArtistPage       아티스트 상세 정보
/auth           AuthPage         로그인 / 회원가입
/register       RegisterPage     아티스트 등록 (4단계)
/admin          AdminPage        관리자 (PIN 인증)
```

---

## 핵심 구현

### 1. Spring 물리 기반 3D 캐러셀

캐러셀 회전을 React state로 관리하면 매 프레임 리렌더링이 발생합니다.
이를 방지하기 위해 모든 위치 계산을 `useFrame` 내부의 ref로만 처리했습니다.

```ts
// src/components/carousel/CircularCarousel.tsx
const RADIUS           = 3.8
const SPRING_TENSION   = 170
const SPRING_FRICTION  = 26
const DRAG_SENSITIVITY = 0.004

// 매 프레임 실행 — React state 없이 ref만으로 물리 계산
const dx    = springTarget.current - springPos.current
const force = dx * SPRING_TENSION - springVel.current * SPRING_FRICTION
springVel.current += force * deltaTime
springPos.current += springVel.current * deltaTime

// 각 카드 위치를 직접 Three.js 오브젝트에 적용
const angle = i * angleStep + springPos.current
group.position.set(
  RADIUS * Math.sin(angle),
  0,
  RADIUS * Math.cos(angle)
)
group.rotation.y = -angle
```

드래그(pointerdown/move/up), 스크롤(wheel), 키보드(ArrowLeft/Right) 세 가지 입력을 모두 지원하며
각 입력이 동일한 `springTarget`을 갱신하는 단일 구조로 설계했습니다.
드래그 판정은 DRAG_THRESHOLD(5px) 기반으로 클릭과 구분합니다.

---

### 2. 카드 상태별 시각 계층

12장의 카드를 카메라와의 각도 차이로 세 가지 상태로 분류하고
scale과 glow opacity를 각각 lerp 처리해 전환이 자연스럽게 이어지도록 했습니다.

```ts
// src/components/carousel/GalleryCard.tsx
const ST = {
  active:     { scale: 1.00, glow: 0.40 },  // 정면 카드
  neighbor:   { scale: 0.82, glow: 0.12 },  // 인접 카드 (±1)
  background: { scale: 0.65, glow: 0.05 },  // 나머지
} as const

// 지수 감쇠 lerp — 프레임레이트 독립적
scaleAnim.current = THREE.MathUtils.lerp(
  scaleAnim.current,
  cfg.scale,
  1 - Math.pow(0.04, dt)
)
outerRef.current.scale.setScalar(scaleAnim.current)
```

---

### 3. 카드 플립 애니메이션

Y축 회전값을 lerp로 `0 → π`로 보내면서, `Math.cos(rotation.y) > 0` 조건으로
앞면/뒷면 전환 시점을 감지했습니다.
불필요한 상태 업데이트를 막기 위해 ref로 현재 면을 캐싱해두고 실제 전환 시에만 setState를 호출합니다.

```ts
flipAnim.current = THREE.MathUtils.lerp(
  flipAnim.current,
  isFlipped ? Math.PI : 0,
  0.09
)
flipRef.current.rotation.y = flipAnim.current

const front = Math.cos(flipAnim.current) > 0
if (front !== showFrontRef.current) {
  showFrontRef.current = front
  setShowFront(front)  // 실제 면 전환 시점에만 호출
}
```

---

### 4. Firebase Firestore 실시간 연동

컴포넌트가 마운트되면 `onSnapshot`으로 artists 컬렉션을 구독합니다.
데이터가 변경되면 Zustand store가 즉시 업데이트되고 캐러셀이 자동으로 재구성됩니다.

```ts
onSnapshot(collection(db, 'artists'), (snapshot) => {
  const artists = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as Artist)
  )
  setArtists(artists)
})
```

---

### 5. Spotify API — Client Credentials 토큰 캐시

만료 60초 전 토큰을 자동 갱신합니다. 인증에 실패하거나 환경변수가 없으면
정적 데이터(`staticArtists`)로 자동 fallback됩니다.

```ts
// server/src/spotify/auth.ts
let cachedToken: string | null = null
let tokenExpiresAt = 0

export async function getSpotifyToken(): Promise<string> {
  // 만료 60초 전까지 캐시 사용
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken
  }
  // Client Credentials 방식으로 새 토큰 요청
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const data = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}` },
    body: 'grant_type=client_credentials',
  }).then(r => r.json())

  cachedToken = data.access_token
  tokenExpiresAt = Date.now() + data.expires_in * 1000
  return cachedToken
}
```

아티스트 목록은 `SEARCH_QUERIES`(genre:indie 등 4가지)에서 랜덤으로 쿼리를 선택하고,
결과를 10분간 서버 메모리에 캐싱합니다.

---

### 6. Three.js 텍스처 안전 로딩

비동기 텍스처 로딩 중 컴포넌트가 언마운트되면 메모리 누수가 발생합니다.
`cancelled` flag 패턴으로 이를 방지하고, 텍스처 로딩 전후 모두 단일 material만 사용해
불필요한 재마운트를 막았습니다.

```ts
// src/hooks/useTextureSafe.ts
export function useTextureSafe(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    setTexture(null)
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'
    loader.load(url, (tex) => {
      if (cancelled) return
      tex.minFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      tex.colorSpace = THREE.SRGBColorSpace
      tex.needsUpdate = true
      setTexture(tex)
    })
    return () => { cancelled = true }
  }, [url])

  return texture
}
```

```tsx
{/* 조건부 material 교체(재마운트) 대신 단일 material에서 map prop만 교체 */}
<meshBasicMaterial map={tex ?? undefined} color={tex ? '#ffffff' : '#1a2e54'} />
```

---

### 7. Zustand 전역 상태

```ts
// src/store/useStore.ts
interface AppState {
  artists:              Artist[]         // Firestore 실시간 데이터
  selectedArtist:       Artist | null    // 상세 페이지 대상
  searchQuery:          string           // 검색어
  genreFilter:          string           // 장르 필터
  currentUser:          FirebaseUser | null  // 로그인 사용자
  isLoading:            boolean          // 전역 로딩
  loadingProgress:      number           // 로딩 진행률 (0~100)
  isTransitioning:      boolean          // 페이지 전환 오버레이
  selectedCarouselIndex: number | null   // 현재 활성 카드 인덱스
  isCardZoomed:         boolean          // ExhibitionCamera 줌 감지 (GuideCharacter 위치 연동)
}
```

`isTransitioning` + `startTransition(callback)` 패턴으로 페이지 전환 시 오버레이 애니메이션과
라우터 이동을 500ms 간격으로 순차 처리합니다.

---

## 데이터 모델

### Firestore

```
artists/{id}
  ├── name:            string
  ├── genres:          string[]
  ├── imageUrl:        string
  ├── description:     string
  ├── featuredTrack:   { name: string, youtubeUrl: string }
  ├── featuredAlbum:   {
  │     name: string,
  │     imageUrl: string,
  │     tracks: [{ number: number, name: string }]
  │   }
  ├── albumYoutubeUrl: string
  ├── spotifyUrl:      string
  └── instagramUrl:    string

users/{uid}
  ├── uid:       string
  ├── nickname:  string
  ├── email:     string
  └── createdAt: Timestamp
```

### Spotify → Artist 변환 (`server/src/transform/spotifyToArtist.ts`)

```
SpotifyArtistRaw + SpotifyAlbumDetail
  → name, imageUrl, genres (최대 3개)
  → featuredAlbum (최신 앨범, 트랙 최대 20개)
  → featuredTrack (첫 번째 트랙 이름)
  → spotifyUrl
  ※ Client Credentials로는 youtubeUrl · instagramUrl 수집 불가 → 빈 문자열
```

---

## 시작하기

```bash
# 1. 의존성 설치
npm install
cd server && npm install && cd ..

# 2. 환경변수 설정 — Spotify (선택)
cp server/.env.example server/.env
# server/.env 에 SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET 입력
# 미설정 시 정적 데이터(staticArtists)로 자동 fallback

# 3. Firebase 설정 (필수)
# 프로젝트 루트에 .env 파일 생성
# VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN 등 입력

# 4. 개발 서버 실행
npm run dev:all     # 프론트엔드(5173) + 백엔드(3001) 동시 실행
```

---

## 문서

| 문서 | 내용 |
|------|------|
| [FRONTEND.md](docs/FRONTEND.md) | 컴포넌트 구조, Zustand 상태, 라우팅, 디자인 토큰 |
| [BACKEND.md](docs/BACKEND.md) | API 엔드포인트, Spotify 인증 흐름, 데이터 변환 |
| [DATABASE.md](docs/DATABASE.md) | Firestore 스키마, Firebase Auth 흐름, 보안 규칙 |
| [THREEJS.md](docs/THREEJS.md) | Spring 물리 캐러셀, 카드 애니메이션, 씬 구성 |

---

## 트러블슈팅

### troika-three-text + WOFF2 폰트 충돌

drei의 `<Text>` 컴포넌트에서 WOFF2 서브셋 폰트를 로드하면 React 트리 전체가 사라지는
silent crash가 발생했습니다. troika-three-text 0.52.4가 WOFF2 서브셋 파싱에 실패하는 것을
확인하고, TTF 파일로 교체해 해결했습니다.

### Three.js 텍스처 Z-fighting

카드 두께(GC_T = 0.04)로 인해 앞면이 `z = +0.020`에 위치하는데,
이미지 플레인을 `z = 0.024`로 배치하면 0.004 단위 간격으로 Z-fighting이 발생했습니다.
이미지 플레인 Z를 `0.050`으로 올려 충분한 간격을 확보해 해결했습니다.

### 조건부 Material 렌더링으로 인한 텍스처 손실

텍스처 로딩 전후에 `{tex ? <mat map={tex}/> : <mat color="..."/>}` 패턴을 사용하면
React가 material을 언마운트/재마운트하면서 텍스처가 손실되는 문제가 있었습니다.
단일 material에서 `map` prop만 교체하는 방식으로 변경해 해결했습니다.

### 캐러셀 클릭 vs 드래그 판별

포인터 이벤트가 드래그인지 클릭인지 구분하지 못해 카드를 드래그해도 클릭으로 인식되는
문제가 있었습니다. `pointerdown` 시 좌표를 기록하고 `pointermove`에서 이동 거리가
`DRAG_THRESHOLD(5px)`를 초과하면 `hasDragged` ref를 true로 설정해 `pointerup` 시 클릭을
무시하도록 처리했습니다.

---

Made with React Three Fiber
