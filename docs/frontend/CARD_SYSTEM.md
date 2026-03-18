# 3D Card System

## 개요

아티스트 카드는 이 프로젝트의 핵심 UI 요소다.
Three.js + React Three Fiber로 구현된 인터랙티브 3D 오브젝트이며,
물리적인 느낌의 인터랙션을 제공한다.

---

## 컴포넌트 계층

```
ArtistCard
  └─ CardTiltController          # 카드 전체 기울기 제어
       └─ [flipGroupRef]         # 플립 애니메이션 그룹
            ├─ CardFront         # 앞면 (앨범 아트 + 트랙 정보)
            │   ├─ CardParallaxLayer (depth=0) → 배경
            │   ├─ CardParallaxLayer (depth=2) → 텍스트
            │   └─ CardParallaxLayer (depth=1) → 프로그레스 바
            └─ CardBack          # 뒷면 (트랙리스트)
```

---

## 카드 크기

```
CARD_W = 2.6  (Three.js 단위)
CARD_H = 4.0
비율 = 2.6 : 4.0 = 1 : 1.538  (세로 직사각형)
```

---

## 플립 메커니즘

```
1. 클릭 → isFlippedRef.current = true
2. useFrame에서 lerp 처리:
   target = isFlipped ? Math.PI : 0
   flipProgressRef.current = lerp(current, target, 0.06)
   flipGroupRef.current.rotation.y = flipProgress

3. 앞/뒤 판단:
   cardFront = vec(0, 0, 1) → 월드 공간으로 변환
   toCamera = camera.position - cardWorldPos
   dot = toCamera · cardFront
   dot > 0 → CardFront 렌더
   dot < 0 → CardBack 렌더

   ※ dot product 기반이라 어떤 카메라 각도에서도 정확히 동작
```

---

## 패럴랙스 시스템

```
CardTiltController
  · useFrame에서 마우스/자이로 tilt 값을 카드 rotation에 적용
  · lerp(current, target, 0.08)으로 부드러운 추종

CardParallaxLayer (depth별)
  · depth=0 : 배경 (거의 움직이지 않음)
  · depth=1 : 중간 레이어 (약간 이동)
  · depth=2 : 전면 텍스트 (가장 많이 이동)
  · 깊이감 = 층별로 이동량이 달라 입체 효과 생성
```

---

## 카드 앞면 (CardFront) 레이아웃

y 좌표계: +2.0(상단) ~ -2.0(하단)

```
y = +1.77 ~ -0.13  ← 앨범 아트 (ART=1.90 정사각형)
y = -0.28           ← 트랙명 (anchorY="top", 최대 2줄)
y = -0.82           ← 아티스트명
y = -0.97           ← 장르 태그
y = -1.20           ← 프로그레스 바
y = -1.65           ← 플레이어 컨트롤 (셔플/이전/재생/다음/반복)
```

---

## 카드 뒷면 (CardBack) 레이아웃

```
y = +1.60           ← 앨범명 헤더 + YouTube 링크
y = +0.46           ← 앨범 아트 (ART=1.25)
y = -0.30           ← "TRACKLIST" 레이블
y = -0.44 ~ -1.73   ← 트랙 목록 (최대 7개, 간격 0.215)
```

---

## 모드 (mode)

| mode | 용도 | 틸트 강도 | 플립 동작 |
|------|------|----------|----------|
| `gallery` | CircularCarousel 내부 | 약함 (0.05) | 클릭 시 선택, 더블클릭 → ArtistPage |
| `detail` | ArtistPage 메인 카드 | 강함 (0.10) | 클릭 → 플립, 더블클릭 → GalleryPage |

---

## 성능 고려사항

- `useTextureSafe`: cancelled flag로 언마운트 후 setState 방지
- 재사용 Three.js 오브젝트: Vector3, Quaternion을 useRef로 사전 할당
- `showFront` 상태 업데이트: dot product 결과가 바뀔 때만 setState
- 갤러리에서 LOD 적용: 전면 ±5장만 실제 카드, 나머지는 BoxGeometry
