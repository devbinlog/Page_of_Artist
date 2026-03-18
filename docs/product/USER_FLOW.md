# User Flow

## 팬 (Fan) 플로우

```
앱 접속 (/)
    │
    ▼
LoadingPage
  · 아티스트 데이터 로드 (API 또는 정적 데이터)
  · 프로그레스 바 표시
    │
    ▼ 로드 완료 → /intro
IntroPage
  · "Page of Artist" 타이틀
  · 아티스트/장르 검색창
  ·  [갤러리 보기] [아티스트 등록]
    │                          │
    │ 검색 결과 클릭            │ [갤러리 보기]
    ▼                          ▼
ArtistPage              GalleryPage (/gallery)
(/artist/:id)             · 원형 3D 캐러셀
                          · 장르 필터 탭
                          · 카드 클릭 → 선택/확대
                          · 카드 더블클릭
                               │
                               ▼
                          ArtistPage (/artist/:id)
                            · 아티스트 카드 (플립 가능)
                            · 비닐 레코드 → Spotify 이동
                            · 앨범 아트 → YouTube 이동
                            · LinkCube → YouTube/Spotify/Instagram
```

---

## 아티스트 (Artist) 등록 플로우

```
IntroPage 또는 GalleryPage
    │ [아티스트 등록] 클릭
    ▼
RegisterPage (/register)
    │
    ├── Step 1: 기본 정보
    │     · 아티스트 이름 (필수)
    │     · 장르 (필수)
    │     · 프로필 이미지 URL
    │     · 소개 (description)
    │     [다음 →]
    │
    ├── Step 2: 아트워크
    │     · 앨범명 (필수)
    │     · 앨범 커버 이미지 URL
    │     · 앨범 YouTube URL
    │     [← 이전] [다음 →]
    │
    ├── Step 3: 음악 정보
    │     · 대표 트랙명 (필수)
    │     · 트랙 YouTube URL
    │     · 트랙 목록 (줄바꿈 구분)
    │     [← 이전] [다음 →]
    │
    └── Step 4: 링크 + 미리보기
          · Spotify URL
          · Instagram URL
          · 카드 미리보기
          [← 이전] [등록하기]
               │
               ▼
          Firestore 저장 (approved: false)
               │
               ▼
          완료 화면
          "검토 후 갤러리에 노출됩니다"
```

---

## 관리자 (Admin) 플로우

```
/admin 접속
    │
    ▼
AdminPage
  · 비밀번호 입력 게이트
    │ 인증 성공
    ▼
  대기 중인 아티스트 목록 (approved: false)
    · 이름, 장르, 등록일 표시
    · [승인] → approved: true → 갤러리 자동 노출
    · [거부] → Firestore 문서 삭제
```

---

## 페이지 전환 방식

| 전환 | 방식 |
|------|------|
| LoadingPage → IntroPage | 자동 (데이터 로드 완료 시) |
| IntroPage → GalleryPage | 버튼 클릭 → navigate |
| IntroPage → ArtistPage | 검색 결과 클릭 → navigate |
| GalleryPage → ArtistPage | 카드 더블클릭 → ZoomTransition → navigate |
| ArtistPage → GalleryPage | ← 갤러리 버튼 → navigate |
| 모든 페이지 → RegisterPage | 버튼 클릭 → navigate |
