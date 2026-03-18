# Phase 2 — System Architecture
# Page of Artist

> 아키텍처 설계 완료일: 2026-03-16

---

## 전체 React 컴포넌트 구조

```
src/
├── App.tsx                  # 라우팅 및 전체 씬 진입점
│
├── pages/
│   ├── LoadingPage.tsx      # 로딩 씬
│   ├── IntroPage.tsx        # 인트로 씬
│   ├── GalleryPage.tsx      # 갤러리 씬
│   └── ArtistPage.tsx       # 아티스트 씬
│
├── components/
│   ├── card/
│   │   ├── ArtistCard.tsx       # 카드 최상위 컴포넌트
│   │   ├── CardFront.tsx        # 앞면 레이어 시스템
│   │   ├── CardBack.tsx         # 뒷면 트랙리스트
│   │   └── CardParallax.tsx     # 틸트 + 패럴랙스 컨트롤러
│   │
│   ├── cube/
│   │   └── LinkCube.tsx         # 링크 큐브 오브젝트
│   │
│   ├── carousel/
│   │   └── CircularCarousel.tsx # 원형 캐러셀 시스템
│   │
│   ├── scene/
│   │   ├── SceneBackground.tsx  # 배경 + 조명
│   │   ├── MusicElements.tsx    # 음표, 조표 3D 오브젝트
│   │   └── StaffLines.tsx       # 오선지
│   │
│   └── vinyl/
│       └── VinylRecord.tsx      # 로딩 비닐 레코드
│
├── hooks/
│   ├── useMouseTilt.ts      # 마우스 틸트 + 카메라 lag
│   ├── useGyroscope.ts      # 모바일 자이로스코프
│   ├── useSwipe.ts          # 모바일 스와이프
│   └── useSpotify.ts        # Spotify API 데이터 fetch
│
├── store/
│   └── useStore.ts          # Zustand 전역 상태
│
├── data/
│   └── artists.ts           # 수동 입력 데이터 (YouTube, Instagram 링크)
│
└── types/
    └── artist.ts            # Artist 타입 정의
```

---

## 상태 관리 — Zustand

```ts
GlobalStore {
  artists: Artist[]          // Spotify API fetch 결과
  currentPage: PageType      // 'loading' | 'intro' | 'gallery' | 'artist'
  selectedArtist: Artist | null  // 현재 선택된 아티스트
  carouselIndex: number      // 캐러셀 현재 위치
  isLoading: boolean         // 로딩 상태
}
```

### Zustand 선택 이유
- R3F `useFrame` 루프 안에서 리렌더링 없이 상태 접근 가능
- Context API 대비 불필요한 리렌더 방지
- 경량, 단순한 API

---

## 씬 전환 전략

페이지 전환은 Three.js 씬 내부에서 처리한다.
React Router가 아닌 **Zustand의 `currentPage` 상태**로 씬을 교체한다.

### 선택 이유
- 3D 트랜지션 애니메이션 완전 제어 가능
- URL 라우팅이 불필요한 단일 캔버스 구조
- 씬 간 오브젝트 공유 가능 (카드 줌 트랜지션)

---

## 카드 오브젝트 설계

카드는 여러 개의 `<mesh>` 플레인을 Z축으로 배치하는 레이어 구조다.

```
ArtistCard
├── CardParallax (틸트 + 레이어 이동 컨트롤러)
│   ├── Z+0.04 — 아티스트 이미지    (Plane mesh + 텍스처)
│   ├── Z+0.03 — 아티스트 이름 텍스트 (drei Text)
│   ├── Z+0.02 — 장르 태그
│   ├── Z+0.01 — 대표곡 + 링크
│   └── Z+0.00 — 배경              (반투명 MeshBasicMaterial)
└── CardBack (Y축 180도 회전 상태)
    ├── 앨범명 텍스트 (YouTube 링크, 수동 데이터)
    ├── 트랙 리스트 텍스트 (Spotify API 데이터)
    └── 배경 (앨범 기반 그라디언트)
```

---

## 인터랙션 컨트롤러 설계

### useMouseTilt
- 마우스 position을 normalized (-1 ~ 1) 로 변환
- 카드 틸트 + 레이어별 패럴랙스 offset 계산
- 카메라 lag 효과 (lerp로 부드럽게 따라옴)

### useGyroscope (모바일)
- `DeviceOrientation` API 사용
- beta(X축), gamma(Y축) 값을 틸트 input으로 변환
- useMouseTilt과 동일한 output interface로 통일

### useSwipe (모바일)
- `touchstart` / `touchend` delta 계산
- 캐러셀 좌우 이동 트리거

---

## 성능 전략

| 항목 | 전략 |
|------|------|
| DPR 제한 | `dpr={[1, 1.5]}` 모바일 최적화 |
| 텍스처 | 아티스트 이미지 압축 + `THREE.LinearFilter` |
| 드로우콜 | 캐러셀 카드 인스턴싱 검토 |
| 텍스트 렌더링 | `@react-three/drei` Text (SDF 기반) |
| 애니메이션 | `useFrame` + lerp, 별도 라이브러리 미사용 |
| 포스트프로세싱 | 미사용 (모바일 성능 고려) |
| 셰이더 | 최소화, 빛 효과는 MeshStandardMaterial로 처리 |

---

## Spotify API 연동 구조

```
useSpotify hook
├── 인증 방식: Client Credentials Flow (유저 로그인 불필요)
├── fetch 시점: 앱 최초 로딩 시 1회
├── 캐싱: sessionStorage (새로고침 방지, 장기 캐싱 금지)
└── 데이터 병합: Spotify 데이터 + artists.ts 수동 데이터 합산
```

### 데이터 분리 원칙
| 데이터 | 출처 |
|--------|------|
| 아티스트 이름, 이미지, 장르 | Spotify API |
| 앨범 정보, 트랙 리스트 | Spotify API |
| Spotify 아티스트 페이지 링크 | Spotify API (`external_urls.spotify`) |
| YouTube 대표곡 링크 | 수동 입력 (`artists.ts`) |
| YouTube 앨범 링크 | 수동 입력 (`artists.ts`) |
| Instagram 링크 | 수동 입력 (`artists.ts`) |

---

## Artist 타입 정의

```ts
interface Artist {
  // Spotify API
  id: string
  name: string
  imageUrl: string
  genres: string[]
  spotifyUrl: string
  featuredAlbum: {
    id: string
    name: string
    imageUrl: string
    tracks: Track[]
  }

  // 수동 입력 (artists.ts)
  featuredTrack: {
    name: string
    youtubeUrl: string
  }
  albumYoutubeUrl: string
  instagramUrl: string
}

interface Track {
  number: number
  name: string
}
```

---

## 다음 단계

→ **Phase 3 — Implementation**
