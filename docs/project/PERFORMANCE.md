# Performance Strategy

## 현재 적용된 최적화

### Three.js / WebGL

| 기법 | 구현 위치 | 효과 |
|------|----------|------|
| LOD (Level of Detail) | CircularCarousel | 전면 ±5장만 텍스처 로드 |
| dpr 제한 | Canvas `dpr={[1, 1.5]}` | Retina 과부하 방지 |
| ref 기반 애니메이션 | ArtistCard, VinylRecord | setState 없이 매 프레임 업데이트 |
| 재사용 Three.js 오브젝트 | ArtistCard useFrame | Vector3, Quaternion 미리 할당 |
| LinearFilter | useTextureSafe | 텍스처 품질 vs 성능 균형 |
| generateMipmaps: false | useTextureSafe | 밉맵 생성 비용 절감 |
| meshBasicMaterial | 배경, 앨범 아트 | 조명 계산 없음 |

---

## 텍스처 관리

```
iTunes CDN 이미지: 600x600px (Three.js 씬에 적합한 크기)
crossOrigin: 'anonymous' → CORS 허용
cancelled flag → 언마운트 후 setState 방지 (메모리 누수 방지)
```

---

## React 렌더링 최적화

| 기법 | 위치 | 설명 |
|------|------|------|
| useMemo | GalleryPage | filteredArtists 재계산 방지 |
| useCallback | CircularCarousel | goNext/goPrev 재생성 방지 |
| ref vs state | ArtistCard | useFrame 내에서 ref 우선 사용 |

---

## 모바일 최적화

| 항목 | 전략 |
|------|------|
| 틸트 입력 | 자이로스코프 자동 전환 |
| 터치 이동 | useSwipe 훅으로 스와이프 처리 |
| 카메라 조작 | ExhibitionCamera 터치 드래그 지원 |
| 파티클 | MusicElements 수 조절 검토 |

---

## 측정 지표 목표

| 지표 | 목표 |
|------|------|
| FPS (갤러리) | 60fps (데스크탑) |
| 초기 로딩 | 3초 이내 인트로 진입 |
| 텍스처 로드 | 전면 카드 1초 이내 표시 |
| 번들 크기 | Three.js 트리쉐이킹 확인 |

---

## 추가 개선 가능한 항목

- [ ] 이미지 레이지 로드 (교체 가능한 `<img>` 요소)
- [ ] Three.js 인스턴스 메시 (같은 형태의 오브젝트 배치 시)
- [ ] Web Worker로 색상 추출 오프로드 (`colorExtract.ts`)
- [ ] Service Worker 캐시 (오프라인 지원)
