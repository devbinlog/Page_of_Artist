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

<img width="1440" height="714" alt="스크린샷 2026-03-19 오전 2 20 47" src="https://github.com/user-attachments/assets/db162e6c-15d3-4c10-b13d-e5b967cab784" />

<img width="1440" height="714" alt="스크린샷 2026-03-19 오전 2 21 03" src="https://github.com/user-attachments/assets/b419d0c3-7653-4d4c-818b-e8ddb85cd428" />

### Artist Card Interaction

<img width="1440" height="714" alt="스크린샷 2026-03-19 오전 2 21 13" src="https://github.com/user-attachments/assets/749bf527-d24b-4142-8c35-32958f96fd64" />

<img width="1440" height="714" alt="스크린샷 2026-03-19 오전 2 21 23" src="https://github.com/user-attachments/assets/f6e0bfa6-882c-4db2-8b63-6daac01b12f1" />

### Artist Detail Page

<img width="1440" height="714" alt="스크린샷 2026-03-19 오전 2 20 19" src="https://github.com/user-attachments/assets/01d7c614-6ec4-44dc-bb0b-7ea6b0380713" />

### Upload Page

<img width="1440" height="714" alt="스크린샷 2026-03-19 오전 2 21 33" src="https://github.com/user-attachments/assets/6080ef49-a840-452e-8631-f0b4a187b327" />

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

---

## 구현 기능

| 기능 | 설명 |
|------|------|
| 3D 캐러셀 | Spring 물리 기반 원형 카드 배치, 드래그 · 스크롤 · 키보드 지원 |
| 카드 플립 | 앞면(아티스트 정보) ↔ 뒷면(앨범 트랙리스트) Y축 애니메이션 |
| 호버 틸트 | 마우스 위치를 기반으로 활성 카드에 ±6° 3D 기울기 적용 |
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
  │     └── Zustand Store (artists, selectedArtist, genreFilter, currentUser)
  │
  ├── Three.js Rendering Layer (WebGL)
  │     ├── Spring 물리 캐러셀 (CircularCarousel)
  │     ├── 3D 카드 오브젝트 (GalleryCard)
  │     └── 씬 구성 요소 (FloorRing, AmbientParticles, StaffLines)
  │
  ├── Firebase Layer
  │     ├── Firestore (아티스트 데이터 실시간 구독)
  │     └── Authentication (사용자 인증 상태 관리)
  │
  └── Express API Server (port 3001)
        └── Spotify Web API → 아티스트 데이터 변환 → 정적 데이터 fallback
```

---

## 페이지 구조

```
/               LoadingPage      로딩 화면
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
이를 방지하기 위해 모든 위치 계산을 useFrame 내부의 ref로만 처리했습니다.

```ts
// 매 프레임 실행 — React state 없이 ref만으로 물리 계산
const dx    = springTarget.current - springPos.current
const force = dx * SPRING_TENSION - springVel.current * SPRING_FRICTION  // tension=170, friction=26
springVel.current += force * deltaTime
springPos.current += springVel.current * deltaTime

// 각 카드 위치를 직접 Three.js 오브젝트에 적용 (DOM 접근 없음)
const angle = i * angleStep + springPos.current
group.position.set(
  RADIUS * Math.sin(angle),
  0,
  RADIUS * Math.cos(angle)
)
group.rotation.y = -angle
```

드래그(pointerdown/move/up), 스크롤(wheel), 키보드(ArrowLeft/Right) 세 가지 입력을 모두 지원하며 각 입력이 동일한 `springTarget`을 갱신하는 단일 구조로 설계했습니다.

---

### 2. 카드 상태별 시각 계층

12장의 카드를 카메라와의 각도 차이로 세 가지 상태로 분류하고 scale과 glow opacity를 각각 다르게 lerp 처리했습니다.

```ts
const ST = {
  active:     { scale: 1.00, glow: 0.40 },  // 정면 카드
  neighbor:   { scale: 0.82, glow: 0.12 },  // 인접 카드 (±1)
  background: { scale: 0.65, glow: 0.05 },  // 나머지
}

// useFrame에서 매 프레임 lerp — 상태 전환 시 부드럽게 이행
scaleAnim.current = THREE.MathUtils.lerp(scaleAnim.current, cfg.scale, 1 - Math.pow(0.04, dt))
outerRef.current.scale.setScalar(scaleAnim.current)
```

---

### 3. 카드 플립 애니메이션

Y축 회전값을 lerp로 0 → π 로 보내면서, `Math.cos(rotation.y) > 0` 조건으로 앞면/뒷면 전환 시점을 정확하게 감지했습니다.  
불필요한 상태 업데이트를 막기 위해 ref에 현재 면을 캐싱해두고 실제 전환 시에만 setState를 호출합니다.

```ts
flipAnim.current = THREE.MathUtils.lerp(flipAnim.current, isFlipped ? Math.PI : 0, 0.09)
flipRef.current.rotation.y = flipAnim.current

const front = Math.cos(flipAnim.current) > 0
if (front !== showFrontRef.current) {   // 전환 시점에만 setState
  showFrontRef.current = front
  setShowFront(front)
}
```

---

### 4. Firebase Firestore 실시간 연동

컴포넌트가 마운트되면 `onSnapshot`으로 artists 컬렉션을 구독합니다.  
데이터가 변경되면 Zustand store가 즉시 업데이트되고 캐러셀이 자동으로 재구성됩니다.

```ts
onSnapshot(collection(db, 'artists'), (snapshot) => {
  const artists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artist))
  setArtists(artists)
})
```

---

### 5. Three.js 텍스처 안전 로딩

비동기 텍스처 로딩 중 컴포넌트가 언마운트되면 메모리 누수가 발생합니다.  
cancelled flag 패턴으로 이를 방지하고, 텍스처 로딩 전후 모두 단일 material만 사용해 불필요한 재마운트를 막았습니다.

```ts
useEffect(() => {
  if (!url) return
  let cancelled = false
  setTexture(null)
  new THREE.TextureLoader().load(url, (tex) => {
    if (cancelled) return   // 언마운트 후 setState 방지
    tex.needsUpdate = true
    setTexture(tex)
  })
  return () => { cancelled = true }
}, [url])
```

```tsx
// 조건부 material 교체(재마운트) 대신 단일 material에서 map prop만 교체
<meshBasicMaterial map={tex ?? undefined} color={tex ? '#ffffff' : '#1a2e54'} />
```

---

## 데이터 모델

```
artists/{id}
  ├── name:            string
  ├── genres:          string[]
  ├── imageUrl:        string
  ├── description:     string
  ├── featuredTrack:   { name, youtubeUrl }
  ├── featuredAlbum:   { name, imageUrl, tracks: [{ number, name }] }
  └── albumYoutubeUrl: string

users/{uid}
  ├── uid:       string
  ├── nickname:  string
  ├── email:     string
  └── createdAt: Timestamp
```

---

## 시작하기

```bash
# 1. 의존성 설치
npm install
cd server && npm install && cd ..

# 2. 환경변수 설정
cp server/.env.example server/.env
# server/.env 에 Spotify Client ID / Secret 입력 (없으면 정적 데이터 사용)

# 3. Firebase 설정
# 프로젝트 루트에 .env 파일 생성 후 Firebase 프로젝트 키 입력

# 4. 개발 서버 실행
npm run dev:all     # 프론트(5173) + 백엔드(3001) 동시 실행
```

---

## 문서

| 문서 | 내용 |
|------|------|
| [FRONTEND.md](docs/FRONTEND.md) | 컴포넌트 구조, Zustand 상태, 라우팅, 디자인 토큰 |
| [BACKEND.md](docs/BACKEND.md) | API 엔드포인트, Spotify 인증 흐름 |
| [DATABASE.md](docs/DATABASE.md) | Firestore 스키마, Firebase Auth 흐름, 보안 규칙 |
| [THREEJS.md](docs/THREEJS.md) | Spring 물리 캐러셀, 카드 애니메이션, Z-fighting 해결 |

---

## 트러블슈팅

### troika-three-text + WOFF2 폰트 충돌

drei의 `<Text>` 컴포넌트 내부에서 WOFF2 서브셋 폰트를 로드하면 React 트리 전체가 사라지는 silent crash가 발생했습니다.  
원인을 추적한 결과 troika-three-text 0.52.4가 WOFF2 서브셋 파싱에 실패하는 것을 확인하고, TTF 파일로 교체해 해결했습니다.

### Three.js 텍스처 Z-fighting

카드 두께(GC_T = 0.04)로 인해 앞면이 z = +0.020 에 위치하는데, 이미지 플레인을 z = 0.024 로 배치하면 0.004 단위 간격으로 Z-fighting이 발생했습니다.  
이미지 플레인 Z를 0.050으로 올려 충분한 간격(0.030)을 확보해 해결했습니다.

### 조건부 Material 렌더링으로 인한 텍스처 손실

텍스처 로딩 전후에 `{tex ? <mat map={tex}/> : <mat color="..."/>}` 패턴을 사용하면 React가 material을 언마운트/재마운트하면서 텍스처가 손실되는 문제가 있었습니다.  
단일 material에서 map prop만 교체하는 방식으로 변경해 해결했습니다.

---

Made with React Three Fiber
