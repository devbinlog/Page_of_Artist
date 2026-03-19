# Page of Artist

아티스트의 음악 세계를 3D 공간에서 탐험하는 인터랙티브 뮤직 갤러리 웹 앱입니다.

React Three Fiber 기반의 Spring 물리 캐러셀 위에 아티스트 카드를 배치하고,
드래그 · 스크롤 · 키보드로 회전하며 카드를 뒤집으면 앨범 트랙리스트가 펼쳐집니다.
Firebase Firestore로 데이터를 실시간 동기화하고, Firebase Auth로 사용자 인증을 처리합니다.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.165-black?logo=three.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FF6F00?logo=firebase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

---

## 화면

### Main 3D Scene

<img width="1440" alt="3D 캐러셀 갤러리" src="https://github.com/user-attachments/assets/db162e6c-15d3-4c10-b13d-e5b967cab784" />

<img width="1440" alt="장르 필터 적용" src="https://github.com/user-attachments/assets/b419d0c3-7653-4d4c-818b-e8ddb85cd428" />

### Artist Card Interaction

<img width="1440" alt="카드 호버 틸트" src="https://github.com/user-attachments/assets/749bf527-d24b-4142-8c35-32958f96fd64" />

<img width="1440" alt="카드 플립 — 트랙리스트" src="https://github.com/user-attachments/assets/f6e0bfa6-882c-4db2-8b63-6daac01b12f1" />

### Artist Detail Page

<img width="1440" alt="아티스트 상세 페이지" src="https://github.com/user-attachments/assets/01d7c614-6ec4-44dc-bb0b-7ea6b0380713" />

### Upload Page

<img width="1440" alt="아티스트 등록 폼" src="https://github.com/user-attachments/assets/6080ef49-a840-452e-8631-f0b4a187b327" />

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18, TypeScript 5.4, Vite 5 |
| 3D 렌더링 | Three.js 0.165, @react-three/fiber 8, @react-three/drei 9 |
| 상태 관리 | Zustand 4 |
| 데이터베이스 | Firebase Firestore |
| 인증 | Firebase Authentication |
| 백엔드 | Node.js, Express, TypeScript (tsx) |
| 외부 API | Spotify Web API |

> 상세 문서: [프론트엔드](docs/FRONTEND.md) · [백엔드](docs/BACKEND.md) · [데이터베이스](docs/DATABASE.md) · [Three.js](docs/THREEJS.md)

---

## 구현 기능

| 기능 | 설명 |
|------|------|
| 3D 캐러셀 | Spring 물리 기반 원형 카드 배치, 드래그 · 스크롤 · 키보드 지원 |
| 카드 플립 | 앞면(아티스트 정보) ↔ 뒷면(앨범 트랙리스트) Y축 애니메이션 |
| 호버 틸트 | 마우스 위치 기반 활성 카드 ±6° 3D 기울기 |
| 장르 필터 | Pop / Hip-Hop / Rock / R&B / Indie / Electronic / Latin |
| 뷰 전환 | 3D 캐러셀 뷰 ↔ 그리드 카드 뷰 |
| 로그인 · 회원가입 | Firebase Authentication (이메일 + 비밀번호) |
| 아티스트 상세 | 앨범 정보, 트랙리스트, YouTube · Spotify · Instagram 링크 |
| 아티스트 등록 | 4단계 멀티스텝 폼, 데이터 Firestore 저장 |
| 관리자 페이지 | PIN 인증 기반 접근, 아티스트 데이터 관리 |

---

## 시스템 구조

```
사용자
  │
  ├── React UI Layer (페이지 라우팅 / 상태 관리)
  │     └── Zustand Store
  │           artists · selectedArtist · genreFilter
  │           currentUser · isTransitioning · searchQuery
  │
  ├── Three.js Rendering Layer (WebGL)
  │     ├── Spring 물리 캐러셀 (CircularCarousel)
  │     ├── 3D 카드 오브젝트 (GalleryCard)
  │     └── 씬 구성 요소 (FloorRing · AmbientParticles · StaffLines)
  │
  ├── Firebase Layer
  │     ├── Firestore  — artists 컬렉션 실시간 구독 (onSnapshot)
  │     └── Auth       — 이메일/비밀번호 인증 상태 관리
  │
  └── Express API Server (port 3001)
        └── Spotify Web API
              → Client Credentials 토큰 자동 갱신
              → 아티스트 + 앨범 데이터 변환
              → 정적 데이터 fallback (credentials 미설정 시)
```

---

## 페이지 구조

```
/               LoadingPage      로딩 화면 (에셋 준비)
/intro          IntroPage        랜딩 — 3D 데모 카드 + 아티스트 검색
/gallery        GalleryPage      3D 캐러셀 갤러리 (메인)
/artist/:id     ArtistPage       아티스트 상세 — 앨범, 트랙, 링크
/auth           AuthPage         로그인 / 회원가입
/register       RegisterPage     아티스트 등록 (4단계 스텝 폼)
/admin          AdminPage        관리자 — PIN 인증 + 데이터 관리
```

---

## 핵심 구현

### 1. Spring 물리 기반 3D 캐러셀

캐러셀 회전을 React state로 관리하면 매 프레임 리렌더링이 발생합니다.
이를 방지하기 위해 모든 위치 계산을 `useFrame` 내부의 `ref`로만 처리했습니다.

```ts
// CircularCarousel.tsx — 매 프레임 실행, React state 없이 ref만으로 물리 계산
const SPRING_TENSION = 170
const SPRING_FRICTION = 26

const dx    = springTarget.current - springPos.current
const force = dx * SPRING_TENSION - springVel.current * SPRING_FRICTION
springVel.current += force * deltaTime
springPos.current += springVel.current * deltaTime

// 각 카드 위치를 직접 Three.js 오브젝트에 적용
const angle = i * angleStep + springPos.current
group.position.set(
  RADIUS * Math.sin(angle),   // RADIUS = 3.8
  0,
  RADIUS * Math.cos(angle)
)
group.rotation.y = -angle
```

드래그(`pointerdown/move/up`), 스크롤(`wheel`), 키보드(`ArrowLeft/Right`) 세 가지 입력을 모두 지원하며
각 입력이 동일한 `springTarget`을 갱신하는 단일 구조로 설계했습니다.

---

### 2. 카드 상태별 시각 계층

12장의 카드를 카메라와의 각도 차이로 세 가지 상태로 분류하고
`scale`과 glow opacity를 각각 `lerp` 처리해 전환이 자연스럽게 이어지도록 했습니다.

```ts
// GalleryCard.tsx
const ST = {
  active:     { scale: 1.00, glow: 0.40 },  // 정면 카드
  neighbor:   { scale: 0.82, glow: 0.12 },  // 인접 카드 (±1)
  background: { scale: 0.65, glow: 0.05 },  // 나머지
} as const

// useFrame 내부 — dt 기반 프레임 독립적 lerp
scaleAnim.current = THREE.MathUtils.lerp(
  scaleAnim.current,
  cfg.scale,
  1 - Math.pow(0.04, dt)
)
outerRef.current.scale.setScalar(scaleAnim.current)
```

---

### 3. 카드 플립 애니메이션

Y축 회전값을 `lerp`로 `0 → π`로 보내면서 `Math.cos(rotation.y) > 0` 조건으로
앞면/뒷면 전환 시점을 감지합니다.
불필요한 상태 업데이트를 막기 위해 `ref`로 현재 면을 캐싱해두고 실제 전환 시에만 `setState`를 호출합니다.

```ts
// GalleryCard.tsx — useFrame
flipAnim.current = THREE.MathUtils.lerp(
  flipAnim.current,
  isFlipped ? Math.PI : 0,
  0.09
)
flipRef.current.rotation.y = flipAnim.current

const front = Math.cos(flipAnim.current) > 0
if (front !== showFrontRef.current) {
  showFrontRef.current = front
  setShowFront(front)   // 전환 시점에만 setState 호출
}
```

---

### 4. Firebase Firestore 실시간 연동

컴포넌트가 마운트되면 `onSnapshot`으로 `artists` 컬렉션을 구독합니다.
데이터가 변경되면 Zustand store가 즉시 업데이트되고 캐러셀이 자동으로 재구성됩니다.

```ts
// GalleryPage.tsx
useEffect(() => {
  const unsub = onSnapshot(collection(db, 'artists'), (snapshot) => {
    const artists = snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() } as Artist)
    )
    setArtists(artists)
  })
  return unsub  // 언마운트 시 구독 해제
}, [])
```

---

### 5. Three.js 텍스처 안전 로딩

비동기 텍스처 로딩 중 컴포넌트가 언마운트되면 메모리 누수가 발생합니다.
`cancelled` flag 패턴으로 이를 방지하고, 텍스처 로딩 전후 모두 단일 material만 사용해
불필요한 재마운트를 막았습니다.

```ts
// hooks/useTextureSafe.ts
export function useTextureSafe(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    setTexture(null)
    new THREE.TextureLoader().load(url, (tex) => {
      if (cancelled) return
      tex.minFilter = THREE.LinearFilter
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
// 조건부 material 교체(재마운트) 대신 단일 material에서 map prop만 교체
<meshBasicMaterial map={tex ?? undefined} color={tex ? '#ffffff' : '#1a2e54'} />
```

---

### 6. Spotify API — Client Credentials 흐름

백엔드에서 Client Credentials grant로 토큰을 발급하고 10분 캐시로 재사용합니다.
서버 시작 시 환경변수가 없으면 정적 데이터를 폴백으로 사용해 오프라인에서도 동작합니다.

```ts
// server/src/spotify/auth.ts
let cachedToken: string | null = null
let tokenExpiresAt = 0

export async function getSpotifyToken(): Promise<string> {
  // 만료 60초 전까지 캐시 사용
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken
  }
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

아티스트 목록 요청 시 장르별 `search` → `artists/{id}/albums` → `albums/{id}` 순으로
3단계 API를 병렬 처리해 데이터를 수집합니다.

---

## 데이터 모델

### Firestore

```
artists/{id}
  ├── name:            string
  ├── genres:          string[]
  ├── imageUrl:        string
  ├── description:     string
  ├── spotifyUrl:      string
  ├── instagramUrl:    string
  ├── featuredTrack:   { name: string, youtubeUrl: string }
  ├── featuredAlbum:   { name: string, imageUrl: string, tracks: Track[] }
  ├── albumYoutubeUrl: string
  ├── approved:        boolean
  └── createdAt:       Timestamp

users/{uid}
  ├── uid:       string
  ├── nickname:  string
  ├── email:     string
  └── createdAt: Timestamp
```

### Zustand Store

```ts
interface AppState {
  artists:               Artist[]
  selectedArtist:        Artist | null
  genreFilter:           string
  searchQuery:           string
  currentUser:           FirebaseUser | null
  isLoading:             boolean
  loadingProgress:       number
  isTransitioning:       boolean
  selectedCarouselIndex: number | null
}
```

---

## 시작하기

```bash
# 1. 의존성 설치
npm install
cd server && npm install && cd ..

# 2. Firebase 환경변수 설정
# 프로젝트 루트 .env 파일 생성
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# 3. Spotify 환경변수 설정 (선택 — 없으면 정적 데이터 사용)
cp server/.env.example server/.env
# server/.env 에 Spotify Client ID / Secret 입력

# 4. 개발 서버 실행
npm run dev:all     # 프론트엔드(5173) + 백엔드(3001) 동시 실행
```

---

## API 엔드포인트

| Method | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 확인 |
| GET | `/api/artists` | 전체 아티스트 목록 (Spotify 또는 정적 데이터) |
| GET | `/api/artists/genres` | 장르 목록 |
| GET | `/api/artist/:id` | 아티스트 상세 (Spotify API 직접 조회) |

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

drei의 `<Text>` 컴포넌트에서 WOFF2 서브셋 폰트를 로드하면 React 트리 전체가 사라지는 silent crash가 발생했습니다.
`troika-three-text 0.52.4`가 WOFF2 서브셋 파싱에 실패하는 것을 확인하고, TTF 파일로 교체해 해결했습니다.

### Three.js 텍스처 Z-fighting

카드 두께(`GC_T = 0.04`)로 인해 앞면이 `z = +0.020`에 위치합니다.
이미지 플레인을 `z = 0.024`로 배치하면 0.004 단위 간격으로 Z-fighting이 발생했습니다.
이미지 플레인 Z를 `0.050`으로 올려 충분한 간격을 확보해 해결했습니다.

### 조건부 Material 렌더링으로 인한 텍스처 손실

텍스처 로딩 전후에 `{tex ? <mat map={tex}/> : <mat color="..."/>}` 패턴을 사용하면
React가 material을 언마운트/재마운트하면서 텍스처가 손실되는 문제가 있었습니다.
단일 material에서 `map` prop만 교체하는 방식으로 변경해 해결했습니다.

---

Made with React Three Fiber
