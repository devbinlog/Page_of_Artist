# Development Roadmap

## 현재 완료된 것 (v0.1)

- [x] React Router v6 라우팅 (5개 경로)
- [x] 3D 카드 갤러리 (원형 캐러셀)
- [x] 카드 플립 + 패럴랙스 틸트
- [x] 장르 필터 (클라이언트 사이드)
- [x] 아티스트 상세 페이지 (비닐 + 앨범)
- [x] Firebase Firestore 연동
- [x] 아티스트 등록 페이지 (단일 폼)
- [x] 30명 아티스트 정적 데이터 (iTunes 앨범 커버)
- [x] 정적 데이터 fallback 패턴

---

## Step 1 — 코드 품질 개선

목표: 기술 부채 해결, 확장 가능한 구조

- [ ] `useTextureSafe` 공유 훅 분리 (CardFront, CardBack, ArtistPage)
- [ ] Zustand store dead state 제거 (currentPage, carouselIndex)
- [ ] `genreFilter` Zustand로 격상
- [ ] `Artist` 타입 단순화 + `description` 필드 추가
- [ ] `styles/tokens.ts` 디자인 토큰 생성
- [ ] `services/artistService.ts` 데이터 레이어 분리
- [ ] 폴더 구조 개선 (features/ 도입)

---

## Step 2 — 갤러리 완성

목표: 갤러리 UX 완성도 향상

- [ ] `genreFilter` URL 쿼리 파라미터 동기화 (`?genre=pop`)
- [ ] `description` 필드를 CardBack에 표시
- [ ] 갤러리 내 실시간 검색 통합
- [ ] 장르별 배경 색상 테마 (Electronic → 보라, Latin → 주황 등)

---

## Step 3 — 등록 플로우 개선

목표: 아티스트 등록 경험 향상

- [ ] 4단계 멀티스텝 등록 구현
  - Step 1: 기본 정보 + description
  - Step 2: 아트워크 (앨범 커버)
  - Step 3: 음악 메타 (트랙리스트)
  - Step 4: 링크 + 카드 미리보기 + 제출
- [ ] 각 스텝 유효성 검사
- [ ] 제출 전 카드 미리보기 (실제 3D 카드 렌더링)

---

## Step 4 — Admin 페이지

목표: 갤러리 품질 관리 기능

- [ ] `/admin` 라우트 추가
- [ ] 비밀번호 인증 게이트
- [ ] 대기 아티스트 목록 (Firestore `approved=false`)
- [ ] 승인/거부 기능
- [ ] 현재 갤러리 아티스트 수 대시보드

---

## Step 5 — 백엔드 개선

목표: 포트폴리오 수준의 백엔드 구조

- [ ] 모듈 구조 도입 (modules/artist, modules/admin, modules/genre)
- [ ] POST /api/artists 엔드포인트 구현
- [ ] PATCH /api/admin/approve/:id 구현
- [ ] GET /api/genres 구현
- [ ] 에러 핸들러 미들웨어 통일
- [ ] config.ts 환경변수 중앙화

---

## Step 6 — 문서화

목표: 포트폴리오로서 읽기 쉬운 프로젝트

- [x] PROJECT_OVERVIEW.md
- [x] PRD.md
- [x] USER_FLOW.md
- [x] FRONTEND_ARCHITECTURE.md
- [x] COMPONENT_TREE.md
- [x] CARD_SYSTEM.md
- [x] GALLERY_DESIGN.md
- [x] BACKEND_ARCHITECTURE.md
- [x] API_SPEC.md
- [x] DATABASE_SCHEMA.md
- [x] UI_GUIDELINES.md
- [x] CARD_DESIGN_SYSTEM.md
- [x] DEVELOPMENT_RULES.md
- [x] ROADMAP.md
- [ ] PERFORMANCE.md
- [ ] DEPLOYMENT.md
- [ ] README.md 최종 업데이트

---

## 우선순위 요약

```
High   Step 1 (코드 품질)   → 포트폴리오 코드 가독성
High   Step 3 (등록 개선)   → 실제 기능 완성도
High   Step 4 (Admin)       → 풀스택 증명
Medium Step 2 (갤러리)      → UX 완성도
Medium Step 5 (백엔드)      → 백엔드 아키텍처 증명
Low    Step 6 (문서)        → 이미 진행 중
```
