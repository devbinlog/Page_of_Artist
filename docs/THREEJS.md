# Three.js / 3D Implementation

## 기술 스택

| 라이브러리 | 버전 | 역할 |
|------------|------|------|
| Three.js | 0.165 | WebGL 3D 렌더링 |
| @react-three/fiber | 8.x | React + Three.js 브릿지 |
| @react-three/drei | 9.x | 유틸리티 (RoundedBox, Text, OrbitControls 등) |
| troika-three-text | 0.52.4 | drei `<Text>` 내부 폰트 렌더러 |

---

## 1. CircularCarousel — Spring 물리 캐러셀

**파일**: `src/components/carousel/CircularCarousel.tsx`

### 핵심 상수

```ts
const RADIUS           = 3.8    // 카드 배치 반경 (world units)
const MAX_CARDS        = 12     // 최대 표시 카드 수
const DRAG_SENSITIVITY = 0.004  // px당 라디안 변환 비율
const SPRING_TENSION   = 170    // 스프링 강도
const SPRING_FRICTION  = 26     // 감쇠 계수
const DRAG_THRESHOLD   = 5      // px — 이 이상이면 드래그로 간주
```

### Spring 물리 공식

```ts
// useFrame 내부 — 매 프레임 실행
const dx    = springTarget - springPos      // 목표와의 거리
const force = dx * SPRING_TENSION - springVel * SPRING_FRICTION
springVel  += force * deltaTime
springPos  += springVel * deltaTime
```

### 카드 위치 배치

```ts
// i번째 카드 위치 (원형 배치)
const angle = i * angleStep + springPos
group.position.set(
  RADIUS * Math.sin(angle),   // X: 원의 수평 위치
  0,                           // Y: 수직 (float 효과는 카드 내부에서)
  RADIUS * Math.cos(angle),   // Z: 원의 깊이
)
group.rotation.y = -angle     // 카드가 항상 카메라를 향하도록
```

### 인터랙션

| 입력 | 동작 |
|------|------|
| 마우스 드래그 | `pointerdown/move/up` — 직접 springPos 이동 |
| 스크롤 휠 | `wheel` — goNext() / goPrev() |
| 키보드 ←→ | `keydown` — goNext() / goPrev() |
| 카드 클릭 | 해당 카드로 snap |
| 카드 더블클릭 | 아티스트 상세 페이지 이동 |

---

## 2. GalleryCard — 미니 카드 컴포넌트

**파일**: `src/components/carousel/GalleryCard.tsx`

### 카드 규격

```ts
export const GC_W = 1.4   // 너비 (world units)
export const GC_H = 2.1   // 높이
export const GC_T = 0.04  // 두께
const        GC_R = 0.08  // 모서리 반경
```

### 카드 상태별 시각 속성

```ts
const ST = {
  active:     { scale: 1.00, glow: 0.40 },   // 정면 카드
  neighbor:   { scale: 0.82, glow: 0.12 },   // 인접 카드 (±1)
  background: { scale: 0.65, glow: 0.05 },   // 배경 카드
}
```

### 애니메이션 (모두 useFrame 기반, React state 없음)

#### Scale lerp
```ts
scaleAnim.current = THREE.MathUtils.lerp(
  scaleAnim.current, cfg.scale, 1 - Math.pow(0.04, deltaTime)
)
outerRef.current.scale.setScalar(scaleAnim.current)
```

#### Float 효과
```ts
outerRef.current.position.y =
  Math.sin(t * Math.PI * 2 * 0.6 + floatSeed * Math.PI * 2) * 0.03
// floatSeed = i / N → 카드마다 다른 위상으로 자연스러운 흔들림
```

#### 호버 틸트 (active 카드만)
```ts
const targetTX = hovered ? -pointerY * 6 * (Math.PI / 180) : 0
const targetTY = hovered ?  pointerX * 6 * (Math.PI / 180) : 0
tiltXAnim.current = THREE.MathUtils.lerp(tiltXAnim.current, targetTX, 0.12)
```

#### 카드 뒤집기 (Y축 flip)
```ts
const flipTarget = isFlipped ? Math.PI : 0
flipAnim.current = THREE.MathUtils.lerp(flipAnim.current, flipTarget, 0.09)
flipRef.current.rotation.y = flipAnim.current
// cos > 0 이면 앞면, cos < 0 이면 뒷면
const showFront = Math.cos(flipAnim.current) > 0
```

### 카드 레이어 Z값

```ts
const Z = 0.05  // 콘텐츠가 카드 앞면(z=+0.020)보다 충분히 앞에 위치
                // Z-fighting 방지 (최소 0.030 간격 확보)
```

---

## 3. 씬 구성 요소

### SceneBackground
배경 그라디언트 + 카메라 움직임에 따른 서브틀한 색상 변화.

### AmbientParticles
랜덤 위치에 떠다니는 작은 파티클들. `useFrame`으로 매 프레임 위치 갱신.

### StaffLines
악보 오선지 모양의 수평선 장식. `THREE.Line` 기반.

### FloorRing
캐러셀 하단의 발광 링.
```ts
// 주 링: 반경 3.55~4.10 (carousel RADIUS=3.8 기준)
// opacity pulse: 0.10 + sin(t * 0.8) * 0.04
```

---

## 4. 카메라 설정

### GalleryPage 카메라

```ts
// GalleryCamera 컴포넌트 (GalleryPage.tsx)
camera.position.set(0, 1.4, 7.0)              // eye-level 시점
camera.lookAt(new THREE.Vector3(0, 0.2, 0))   // 원형 중심보다 약간 아래
camera.fov = 50
// 카메라 거리(7.0) > 캐러셀 반경(3.8) → 카드 정면이 카메라를 향함
```

### IntroPage 데모 카메라

```ts
camera={{ position: [0, 0.3, 7.0], fov: 44 }}
// OrbitControls autoRotate, autoRotateSpeed=2.2
// 클릭 → targetRotY -= Math.PI (우측 방향 스핀)
```

---

## 5. 텍스처 로딩 — useTextureSafe

**파일**: `src/hooks/useTextureSafe.ts`

```ts
// cancelled 플래그 패턴 — 컴포넌트 언마운트 시 텍스처 적용 방지
export function useTextureSafe(url: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null)
  useEffect(() => {
    if (!url) return
    let cancelled = false
    new THREE.TextureLoader().load(url, (t) => {
      if (!cancelled) setTex(t)
    })
    return () => { cancelled = true }
  }, [url])
  return tex
}
```

> **CORS 주의**: Apple Music (mzstatic.com) 이미지는 CORS 차단됨.
> Wikimedia Commons, Spotify CDN 이미지는 정상 로드됨.

---

## 6. 알려진 이슈 및 해결책

### troika-three-text + WOFF2 = Crash
- **증상**: `<Text font="/.../xxx.woff2">` 사용 시 React 트리 전체 소멸 (silent crash)
- **원인**: troika-three-text가 WOFF2 서브셋 폰트 파싱 실패
- **해결**: `.ttf` 파일만 사용 (Playfair-Bold.ttf, Montserrat-*.ttf)

### new THREE.Color('rgb(...)')
- `rgb()` 문자열 Color 생성자 사용 시 예상치 못한 결과 가능
- **해결**: 항상 hex 문자열 사용: `color="#4F7DF3"`

### Z-Fighting (이미지 vs 카드 앞면)
- 카드 두께 GC_T=0.04 → 앞면 표면이 z=+0.020에 위치
- 이미지/텍스트 플레인이 너무 가까우면 깜박임 발생
- **해결**: 콘텐츠 Z=0.05 (간격 0.030 확보)
