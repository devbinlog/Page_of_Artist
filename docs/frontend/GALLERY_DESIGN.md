# Gallery Design

## 개요

갤러리는 아티스트 발견의 핵심 화면이다.
3D 원형 캐러셀 + 장르 필터 탭으로 구성된다.

---

## 원형 캐러셀 구조

```
카메라 고정 (5.5, 0, 0) 시점
         ↓
    [캐러셀 그룹]  → Y축 회전

   카드 배치: 반지름 4.2, 최대 30개
   angleStep = 2π / N
   x = sin(angle) × 4.2
   z = cos(angle) × 4.2
```

---

## 인터랙션

| 동작 | 결과 |
|------|------|
| 드래그 좌우 | 캐러셀 회전 (ExhibitionCamera) |
| 스크롤 | 카메라 줌 인/아웃 |
| 마우스 흔들기 | 캐러셀 넘기기 |
| 스와이프 (모바일) | 캐러셀 넘기기 |
| 자동 | 4초마다 다음 카드 |
| 카드 클릭 | 해당 카드를 전면으로 이동 + 확대 (scale 0.65 → 1.0) |
| 카드 더블클릭 | ZoomTransition → ArtistPage |

---

## LOD (Level of Detail)

성능을 위해 전면에서 거리에 따라 카드 복잡도를 다르게 렌더링한다.

```
distFromFront ≤ 5  →  실제 ArtistCard (텍스처 포함)
distFromFront >  5  →  BoxGeometry placeholder (텍스처 없음)
```

30개 카드 중 항상 최대 11개(±5 + 전면 1)만 텍스처를 로드한다.

---

## 장르 필터

```
[전체] [Pop] [Hip-Hop] [Rock] [R&B] [Indie] [Electronic] [Latin]

선택된 탭:
  background: rgba(59,106,255,0.85)
  color: #ffffff
  fontWeight: 600

미선택 탭:
  background: rgba(255,255,255,0.65)
  color: #3B6AFF
  숫자 표시: (N명)

필터 로직:
  artists.filter(a => a.genres.some(g => g.toLowerCase().includes(genre)))
```

`genreFilter` 상태는 Zustand에 저장되어 페이지 이동 후 복귀 시 유지된다.

---

## 씬 설정

```
배경: linear-gradient(160deg, #f0f6ff 0%, #dbeafe 60%, #ede9ff 100%)
카메라: position=[0, 0, 5.5], fov=72
dpr: [1, 1.5]
```

---

## 확장 고려사항

현재 원형 캐러셀은 최대 30개 카드에 최적화되어 있다.
아티스트가 30명 이상이 되면:

1. 장르 필터로 표시 수 제한 (현재 구조로 가능)
2. 페이지네이션 도입 (원형 → 그리드 레이아웃 추가)
3. `RADIUS` 값 증가로 더 많은 카드 수용 가능
