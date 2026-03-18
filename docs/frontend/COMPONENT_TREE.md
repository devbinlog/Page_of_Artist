# Component Tree

## 전체 컴포넌트 계층도

```
App
  └─ BrowserRouter
       ├─ NavigationSetup          (navigate 전역 등록 + 데이터 로드)
       ├─ Routes
       │   ├─ /           → LoadingPage
       │   ├─ /intro      → IntroPage
       │   ├─ /gallery    → GalleryPage
       │   ├─ /artist/:id → ArtistPage
       │   ├─ /register   → RegisterPage
       │   └─ /admin      → AdminPage
       └─ ZoomTransition            (전역 페이지 전환 오버레이)
```

---

## LoadingPage

```
LoadingPage
  └─ [HTML] 로딩 바 + 진행률 표시
     · Zustand loadingProgress 구독
```

---

## IntroPage

```
IntroPage
  ├─ Canvas
  │   └─ IntroScene
  │        ├─ SceneBackground
  │        ├─ MusicElements
  │        ├─ StaffLines
  │        ├─ [Text] "Page of Artist"
  │        ├─ [RoundedBox] 검색창 시각 요소
  │        ├─ SearchResults
  │        │   └─ [RoundedBox + Text] × results.length
  │        ├─ [RoundedBox] 갤러리 버튼
  │        └─ [RoundedBox] 아티스트 등록 버튼
  └─ [HTML] input 검색창 오버레이
```

---

## GalleryPage

```
GalleryPage
  ├─ Canvas
  │   ├─ SceneBackground
  │   ├─ ExhibitionCamera
  │   ├─ MusicElements
  │   ├─ StaffLines
  │   └─ CircularCarousel
  │        └─ ArtistCard × N  (또는 BoxGeometry placeholder)
  │             ├─ CardTiltController
  │             │   └─ [flipGroup]
  │             │        ├─ CardFront
  │             │        │   ├─ CardParallaxLayer (배경)
  │             │        │   ├─ CardParallaxLayer (텍스트)
  │             │        │   └─ CardParallaxLayer (컨트롤)
  │             │        └─ CardBack
  │             └─ [RoundedBox] glow 테두리
  ├─ [HTML] 네비게이션 버튼 (← 홈, 아티스트 등록)
  ├─ [HTML] GenreFilterBar (장르 탭)
  ├─ [HTML] 필터 결과 수
  └─ [HTML] 조작 안내 텍스트
```

---

## ArtistPage

```
ArtistPage
  ├─ Canvas
  │   ├─ SceneBackground
  │   ├─ ExhibitionCamera
  │   ├─ MusicElements
  │   ├─ StaffLines
  │   ├─ ArtistCard (mode="detail")
  │   ├─ VinylRecord
  │   │   └─ [spinGroup] 레코드 + 레이블 + glow
  │   ├─ AlbumDisplay
  │   │   └─ [RoundedBox] 프레임 + 앨범 아트 + 텍스트
  │   └─ LinkCube × 1~3
  ├─ [HTML] 네비게이션 버튼 (← 갤러리, 홈)
  └─ [HTML] 조작 안내 텍스트
```

---

## RegisterPage (멀티스텝)

```
RegisterPage
  ├─ StepIndicator (1/2/3/4)
  └─ [step === 1] Step1BasicInfo
     [step === 2] Step2Artwork
     [step === 3] Step3Music
     [step === 4] Step4LinksPreview
                   └─ ArtistCard 미리보기 (선택적)
```

---

## AdminPage

```
AdminPage
  ├─ [인증 전] 비밀번호 입력 게이트
  └─ [인증 후]
       ├─ 대기 아티스트 수 요약
       └─ PendingArtistCard × N
            · 이름, 장르, 등록일
            · [승인] [거부] 버튼
```

---

## 공유 UI 컴포넌트

```
components/ui/
  ├─ Button       props: label, variant(primary|secondary), onClick, disabled
  ├─ Input        props: label, value, onChange, placeholder, required
  ├─ Tag          props: label, color (장르 뱃지)
  └─ Modal        props: isOpen, onClose, children
```
