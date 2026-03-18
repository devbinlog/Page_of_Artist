# Development Rules

## 코딩 컨벤션

### 파일명

```
컴포넌트:     PascalCase.tsx       (ArtistCard.tsx)
훅:           camelCase.ts         (useTextureSafe.ts)
서비스:       camelCase.ts         (artistService.ts)
타입:         camelCase.ts         (artist.ts)
유틸:         camelCase.ts         (colorExtract.ts)
상수:         UPPER_SNAKE_CASE     (CARD_W, STATIC_ARTISTS)
```

### Import 순서

```ts
// 1. React
import { useState, useEffect } from 'react'

// 2. 외부 라이브러리
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'

// 3. 내부 — 절대 경로 (@/)
import { ArtistCard } from '@/features/artist-card'
import { useStore } from '@/store/useStore'

// 4. 내부 — 타입
import type { Artist } from '@/types/artist'
```

---

## 3D 코드 규칙

### useFrame 내에서 setState 금지

```ts
// 나쁨
useFrame(() => {
  setRotation(rotation + 0.01)  // 매 프레임 리렌더 유발
})

// 좋음
useFrame(() => {
  if (meshRef.current) {
    meshRef.current.rotation.y += 0.01  // ref 직접 조작
  }
})
```

### 재사용 Three.js 오브젝트

```ts
// useFrame 내 매 프레임 new Vector3() 금지
const _vec = useRef(new THREE.Vector3())  // 미리 할당
useFrame(() => {
  _vec.current.set(x, y, z)  // 재사용
})
```

### 텍스처 로딩

```ts
// useTextureSafe 훅 사용 (공유 훅)
// cancelled flag로 메모리 누수 방지
import { useTextureSafe } from '@/hooks/useTextureSafe'
const texture = useTextureSafe(imageUrl)
```

---

## 컴포넌트 규칙

### 3D 카드 파일은 수정하지 않는다

다음 파일은 정밀하게 조율된 3D 좌표계를 가지고 있어 수정 시 레이아웃 붕괴 위험:

```
features/artist-card/CardFront.tsx   ← 수정 금지
features/artist-card/CardBack.tsx    ← 수정 금지
features/artist-card/ArtistCard.tsx  ← 수정 금지
features/artist-card/CardParallax.tsx ← 수정 금지
```

### Props는 최소화

컴포넌트에 Zustand store를 직접 넣지 않는다.
필요한 값만 props로 내려준다.

```ts
// 나쁨
function VinylRecord() {
  const { selectedArtist } = useStore()  // 컴포넌트가 store에 결합됨
}

// 좋음
function VinylRecord({ albumImageUrl, spotifyUrl, artistName }) {
  // 외부에서 값 주입
}
```

---

## 브랜치 전략

```
main          프로덕션 배포 브랜치
dev           개발 통합 브랜치
feat/xxx      기능 개발
fix/xxx       버그 수정
docs/xxx      문서 작업
```

---

## 커밋 메시지

```
feat: 멀티스텝 등록 플로우 구현
fix: 카드 플립 더블클릭 타이밍 수정
refactor: useTextureSafe 공유 훅으로 분리
docs: API_SPEC.md 작성
style: 디자인 토큰 tokens.ts 추가
```

---

## 환경변수 규칙

- 프론트엔드: `VITE_` 접두사 필수
- 백엔드: `server/.env` 별도 관리
- `.env.local`, `.env` 는 `.gitignore`에 포함
- `.env.example` 은 항상 최신 상태 유지
