# Three.js & 3D Implementation

## 기술 스택

| 라이브러리 | 버전 | 역할 |
|------------|------|------|
| Three.js | 0.165 | WebGL 3D 렌더링 엔진 |
| @react-three/fiber | 8.x | React 컴포넌트 트리로 Three.js 씬 선언 |
| @react-three/drei | 9.x | RoundedBox, Text, OrbitControls 등 유틸리티 |
| troika-three-text | 0.52.4 | drei `<Text>` 내부 폰트 SDF 렌더러 |

---

## 1. CircularCarousel — Spring 물리 캐러셀

`src/components/carousel/CircularCarousel.tsx`

### 설계 원칙

React state로 회전 값을 관리하면 매 프레임 리렌더링이 발생합니다.
모든 물리 계산과 위치 갱신을 `useRef` + `useFrame` 조합으로만 처리해
React 렌더링 사이클과 완전히 분리했습니다.

### 핵심 상수

```ts
const RADIUS           = 3.8    // 카드 배치 원의 반경 (Three.js world unit)
const MAX_CARDS        = 12     // 최대 표시 카드 수
const DRAG_SENSITIVITY = 0.004  // 마우스 1px → 0.004 라디안 회전
const SPRING_TENSION   = 170    // 스프링 강도 (높을수록 빠르게 목표 위치 추종)
const SPRING_FRICTION  = 26     // 감쇠 계수 (높을수록 오버슈트 억제)
const DRAG_THRESHOLD   = 5      // 이 px 이상 이동해야 드래그로 판정
```

### Spring 물리 계산

```ts
// useFrame 내부 — 매 프레임 실행
const dx    = springTarget.current - springPos.current   // 목표와의 거리
const force = dx * SPRING_TENSION - springVel.current * SPRING_FRICTION
springVel.current += force * deltaTime
springPos.current += springVel.current * deltaTime
```

SPRING_TENSION=170 / SPRING_FRICTION=26 조합으로 약간의 오버슈트 후 빠르게 안정되는
자연스러운 스냅 감을 구현했습니다.

### 원형 카드 배치

```ts
for (let i = 0; i < N; i++) {
  const angle = i * angleStep + springPos.current
  group.position.set(
    RADIUS * Math.sin(angle),  // X: 수평 위치
    0,                          // Y: 수직 (float은 카드 내부에서 처리)
    RADIUS * Math.cos(angle),  // Z: 깊이
  )
  group.rotation.y = -angle    // 카드 앞면이 항상 원 중심(카메라)을 향하도록
}
```

### 입력 처리

세 가지 입력이 모두 `springTarget`을 갱신하는 단일 구조입니다.

```ts
// 드래그 — pointerdown/move/up
function onPointerMove(e: PointerEvent) {
  const dx = e.clientX - dragStartX.current
  if (Math.abs(dx) > DRAG_THRESHOLD) hasDragged.current = true
  springTarget.current = dragStartRot.current + dx * DRAG_SENSITIVITY
  springPos.current = springTarget.current   // 드래그 중 즉시 따라오도록
}

// 스크롤 — wheel
function onWheel(e: WheelEvent) {
  e.preventDefault()
  if (e.deltaY > 0) goNext() else goPrev()
}

// 키보드 — keydown
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') goNext()
  else if (e.key === 'ArrowLeft')  goPrev()
}
```

### 스냅 알고리즘

드래그 종료 시 현재 회전 값에서 가장 가까운 카드 인덱스로 스냅합니다.

```ts
function onPointerUp() {
  if (!hasDragged.current) return
  const nearest = Math.round(springTarget.current / angleStep)
  springTarget.current = nearest * angleStep          // 정수 배수로 보정
  const newActive = wrap(-nearest, N)                 // 음수 처리 포함 modulo
  activeIndexRef.current = newActive
  setActiveIndex(newActive)
}
```

---

## 2. GalleryCard — 3D 카드 컴포넌트

`src/components/carousel/GalleryCard.tsx`

### 카드 규격

```ts
GC_W = 1.4   // 너비 (Three.js world unit)
GC_H = 2.1   // 높이
GC_T = 0.04  // 두께 — 앞면 표면이 z = +0.020 에 위치
GC_R = 0.08  // 모서리 반경 (RoundedBox)
```

### 카드 상태 시스템

카메라 정면에서의 각도 차이로 세 가지 상태를 부여하고,
각 상태의 목표값으로 lerp해 전환을 자연스럽게 처리합니다.

```ts
const ST = {
  active:     { scale: 1.00, glow: 0.40 },  // 정면 카드 — 크고 선명
  neighbor:   { scale: 0.82, glow: 0.12 },  // 인접 카드 (±1) — 중간
  background: { scale: 0.65, glow: 0.05 },  // 나머지 — 작고 희미
}
```

### Scale 애니메이션

```ts
// 프레임 독립적인 lerp — deltaTime 기반으로 속도 일정
scaleAnim.current = THREE.MathUtils.lerp(
  scaleAnim.current,
  cfg.scale,
  1 - Math.pow(0.04, deltaTime)  // dt=0.016일 때 약 0.087 비율로 수렴
)
outerRef.current.scale.setScalar(scaleAnim.current)
```

### Float 애니메이션

각 카드가 다른 위상으로 상하로 부유합니다.
`floatSeed = i / N` 으로 카드마다 위상을 분산시켜 동시에 같은 방향으로 움직이지 않도록 합니다.

```ts
outerRef.current.position.y =
  Math.sin(t * Math.PI * 2 * 0.6 + floatSeed * Math.PI * 2) * 0.03
// 0.6 Hz 주기로 ±0.03 unit 부유
```

### 호버 틸트 (active 카드 전용)

마우스 위치를 카드 크기로 정규화(-1 ~ +1)해 3D 기울기로 변환합니다.

```ts
// e.point (world space) → 카드 로컬 좌표 → -1~1 정규화
pointerPos.current = {
  x: Math.max(-1, Math.min(1, (e.point.x - wp.x) / (GC_W * 0.5))),
  y: Math.max(-1, Math.min(1, (e.point.y - wp.y) / (GC_H * 0.5))),
}

// ±6° 기울기로 변환, lerp 0.12로 부드럽게 추종
const targetTX = hovered ? -pointerPos.current.y * 6 * (Math.PI / 180) : 0
tiltXAnim.current = THREE.MathUtils.lerp(tiltXAnim.current, targetTX, 0.12)
outerRef.current.rotation.x = tiltXAnim.current
```

### 카드 플립 애니메이션

Y축 회전값을 0 → π 로 lerp하면서 `Math.cos` 값으로 앞/뒷면 전환 시점을 감지합니다.
setState는 면이 실제로 전환되는 순간에만 호출해 불필요한 리렌더링을 방지합니다.

```ts
const flipTarget = isFlipped ? Math.PI : 0
flipAnim.current = THREE.MathUtils.lerp(flipAnim.current, flipTarget, 0.09)
flipRef.current.rotation.y = flipAnim.current

// cos(0) = 1 (앞면), cos(π) = -1 (뒷면), cos(π/2) = 0 (전환 시점)
const front = Math.cos(flipAnim.current) > 0
if (front !== showFrontRef.current) {   // 전환 시에만 setState
  showFrontRef.current = front
  setShowFront(front)
}
```

### 카드 레이어 Z 오프셋

카드 두께 GC_T = 0.04이므로 앞면 표면은 z = +0.020 에 위치합니다.
이미지와 텍스트 플레인은 z = 0.050 으로 배치해 Z-fighting을 방지합니다.

```
카드 앞면 표면:  z = +0.020
이미지 플레인:   z = +0.050  (간격 0.030 — Z-fighting 없음)
텍스트:          z = +0.050 ~ +0.054
```

### 카드 앞면 레이아웃

```
카드 높이 GC_H = 2.1 (Y: -1.05 ~ +1.05)

+1.040  ┌──────────────────────────────────┐
        │  [장르 뱃지]                      │
        │                                  │
        │       아티스트 사진              │  ← 48% (1.008 height)
        │       (IMG_H = 1.008)            │
        │                                  │
+0.032  ├──────────────────────────────────┤ ← BEL (이미지 하단)
        │                                  │
-0.108  │  ARTIST NAME                     │  ← 아티스트 이름
        │                                  │
-0.268  │  ♪ Track Name        [▶]         │  ← 대표곡 + 재생 버튼
        │                                  │
-0.408  │  ─────────────────────           │  ← 구분선
        │                                  │
        │  ┌──────────────────────────┐    │
        │  │  ALBUM                   │    │
-0.568  │  │  앨범 이름               │    │  ← 앨범 패널
        │  │                          │    │
        │  └──────────────────────────┘    │
        │                                  │
-0.945  │  FLIP FOR TRACKLIST              │  ← 플립 힌트
        │                                  │
-1.050  └──────────────────────────────────┘  ← 하단 액센트 스트립
```

---

## 3. 씬 구성 요소

### SceneBackground

`src/components/scene/SceneBackground.tsx`

카메라의 방위각에 따라 배경 색상이 미세하게 변하는 그라디언트 배경입니다.
`useFrame`에서 카메라 방향 벡터를 읽어 배경 색상 uniform을 업데이트합니다.

### AmbientParticles

`src/components/scene/AmbientParticles.tsx`

랜덤 위치에 배치된 수백 개의 작은 파티클이 천천히 부유합니다.
`THREE.Points`와 `BufferGeometry`로 단일 draw call로 처리해 성능을 유지합니다.

### StaffLines

`src/components/scene/StaffLines.tsx`

악보 오선지 모양의 수평선 5개를 `THREE.Line`으로 렌더링합니다.
캐러셀 뒤편에 배치해 음악 플랫폼의 시각적 아이덴티티를 강조합니다.

### FloorRing

`src/components/scene/FloorRing.tsx`

캐러셀 하단에 배치된 발광 링입니다.
`ringGeometry`로 생성하며, `useFrame`에서 opacity를 주기적으로 변화시켜 pulse 효과를 줍니다.

```ts
// opacity pulse — 0.10 ~ 0.14 사이를 0.8 Hz 주기로 변동
mat.opacity = 0.10 + Math.sin(clock.getElapsedTime() * 0.8) * 0.04
```

캐러셀 반경 RADIUS = 3.8 에 맞춰 링 반경을 3.55 ~ 4.10 으로 설정했습니다.

---

## 4. 카메라 설정

### GalleryPage 카메라

`src/pages/GalleryPage.tsx` — `GalleryCamera` 컴포넌트

```ts
camera.position.set(0, 1.6, 9.0)
camera.lookAt(new THREE.Vector3(0, 0.0, 0))
camera.fov = 46
```

- 카메라 z = 9.0 > 캐러셀 반경 3.8 → 카드 정면이 카메라를 향함
- fov = 46° — 좁은 화각으로 원근감을 살리고 카드를 크게 표현
- y = 1.6 — 살짝 위에서 내려다보는 eye-level 구도

### IntroPage 데모 카메라

```ts
camera={{ position: [0, 0.3, 7.0], fov: 44 }}
```

OrbitControls를 사용해 autoRotate (speed: 2.2)로 자동 회전하며,
카드 클릭 시 `targetRotY -= Math.PI` 로 우측 방향 스핀을 누적합니다.

---

## 5. 텍스처 로딩

`src/hooks/useTextureSafe.ts`

### 설계 결정

Three.js `TextureLoader`는 비동기로 이미지를 로드합니다.
두 가지 문제가 있었습니다.

첫째, 로딩 중 컴포넌트가 언마운트되면 `setTexture()` 호출로 메모리 누수가 발생합니다.
→ `cancelled` flag 패턴으로 해결

둘째, `{tex ? <mat map={tex}/> : <mat color="..."/>}` 조건부 렌더링은
텍스처 로딩 시 material이 언마운트/재마운트되어 텍스처가 손실됩니다.
→ 단일 material에서 `map` prop만 교체하는 방식으로 해결

```ts
export function useTextureSafe(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    setTexture(null)

    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'
    loader.load(
      url,
      (tex) => {
        if (cancelled) return
        tex.minFilter    = THREE.LinearFilter
        tex.magFilter    = THREE.LinearFilter
        tex.generateMipmaps = false
        tex.colorSpace   = THREE.SRGBColorSpace
        tex.needsUpdate  = true
        setTexture(tex)
      },
      undefined,
      () => { /* CORS 또는 404 — null 유지, fallback 색상 표시 */ }
    )

    return () => { cancelled = true }
  }, [url])

  return texture
}
```

```tsx
// 사용 — 단일 material, map prop만 교체
<meshBasicMaterial
  map={tex ?? undefined}
  color={tex ? '#ffffff' : '#1a2e54'}
/>
```

### CORS 고려사항

| 도메인 | CORS 지원 여부 |
|--------|---------------|
| upload.wikimedia.org | 허용 — 아티스트 사진에 사용 |
| i.scdn.co (Spotify CDN) | 허용 |
| is1-ssl.mzstatic.com (Apple Music CDN) | 차단 — 사용 불가 |

---

## 6. 성능 고려사항

### useFrame 업데이트 최소화

Three.js 오브젝트 위치/회전 업데이트는 모두 ref를 통해 직접 처리합니다.
React state 업데이트는 UI 전환(앞면/뒷면 토글)이 필요한 최소한의 경우에만 사용합니다.

### 카드 수 제한

`MAX_CARDS = 12` 로 캐러셀에 표시되는 카드 수를 제한합니다.
각 카드는 다수의 `meshBasicMaterial`과 `Text` 컴포넌트를 포함하므로
무한히 늘리면 드로우 콜이 급증합니다.

### 텍스처 설정 최적화

```ts
tex.minFilter    = THREE.LinearFilter   // mipmap 생성 비용 제거
tex.generateMipmaps = false             // 불필요한 메모리 절약
tex.colorSpace   = THREE.SRGBColorSpace // 정확한 색상 표현
```

---

## 7. 알려진 이슈 및 해결

### troika-three-text + WOFF2 폰트

drei의 `<Text font="*.woff2">` 사용 시 troika-three-text가 WOFF2 서브셋 파싱에 실패해
React 트리 전체가 언마운트됩니다. 화면이 완전히 사라지지만 에러 메시지가 없어 디버깅이 어렵습니다.
TTF 전체 폰트 파일 사용으로 해결했습니다.

### new THREE.Color('rgb(r,g,b)')

Three.js의 `Color` 생성자에 `rgb()` 문자열을 전달하면 예상치 못한 색상이 출력될 수 있습니다.
항상 hex 문자열을 직접 사용합니다: `color="#4F7DF3"`

### Z-Fighting

카드 두께 GC_T = 0.04 → 앞면 z = +0.020.
이미지 플레인을 z = 0.024 로 배치했을 때(간격 0.004) Z-fighting이 발생했습니다.
z = 0.050 으로 올려(간격 0.030) 해결했습니다.
