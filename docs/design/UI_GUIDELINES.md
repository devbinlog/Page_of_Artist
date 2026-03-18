# UI Guidelines

## 디자인 컨셉

**"밤하늘의 전시관"**

어두운 우주 배경 위에 발광하는 카드들이 떠있는 느낌.
인트로/등록/어드민: 다크 테마 (심야 공연장)
갤러리/아티스트 상세: 라이트 테마 (낮의 전시관)

---

## 색상 팔레트

### 브랜드 색상

| 이름 | 값 | 용도 |
|------|-----|------|
| brand | `#6C8EFF` | 주요 강조색, 버튼, 테두리 |
| brandDark | `#3B6AFF` | 호버 상태, 강조 |
| brandPurple | `#7C3AFF` | 보조 강조 (등록 버튼) |

### 다크 테마 (인트로, 등록, 어드민)

| 이름 | 값 | 용도 |
|------|-----|------|
| bgDark | `linear-gradient(135deg, #0f0c29, #302b63, #24243e)` | 페이지 배경 |
| surfaceDark | `rgba(13,20,55,0.85)` | 입력창, 카드 배경 |
| borderDark | `rgba(108,142,255,0.25)` | 입력창 테두리 |
| textPrimary | `#E8EAFF` | 주요 텍스트 |
| textMuted | `#8892B0` | 보조 텍스트, 레이블 |

### 라이트 테마 (갤러리, 아티스트)

| 이름 | 값 | 용도 |
|------|-----|------|
| bgLight | `linear-gradient(160deg, #f0f6ff, #dbeafe, #ede9ff)` | 페이지 배경 |
| surfaceLight | `rgba(255,255,255,0.75)` | 버튼, 카드 배경 |
| borderLight | `rgba(108,142,255,0.4)` | 테두리 |
| textDark | `#1e3a6e` | 주요 텍스트 (라이트) |
| textDim | `#6B80A8` | 안내 텍스트 |

---

## 타이포그래피

### 3D 씬 내부 (Three.js Text)

| 폰트 | 용도 |
|------|------|
| Montserrat-SemiBold.ttf | 레이블, 버튼, 수치 |
| Montserrat-Regular.ttf | 본문, 트랙명 |
| Playfair-Bold.ttf | 앨범명 헤더 |

### HTML UI

```css
font-family: sans-serif;  /* 시스템 폰트 */
```

---

## 간격 시스템

| 이름 | 값 | 용도 |
|------|-----|------|
| xs | 4px | 최소 간격 |
| sm | 8px | 작은 간격 |
| md | 12–16px | 기본 간격 |
| lg | 24–28px | 섹션 간격 |
| xl | 32–40px | 페이지 패딩 |

---

## 테두리 반경

| 이름 | 값 | 용도 |
|------|-----|------|
| sm | 8px | 입력창 |
| md | 12px | 버튼 |
| lg | 20px | 카드, 패널 |
| pill | 999px | 장르 태그, 둥근 버튼 |

---

## 버튼 스타일

### Primary

```css
background: linear-gradient(135deg, #6C8EFF, #3B6AFF);
color: #ffffff;
border: none;
border-radius: 12px;
padding: 11px 24px;
font-weight: 600;
```

### Secondary

```css
background: rgba(255,255,255,0.08);
color: #8892B0;
border: 1px solid rgba(108,142,255,0.3);
border-radius: 12px;
padding: 11px 24px;
```

### Nav (Glass)

```css
background: rgba(255,255,255,0.75);
color: #3B6AFF;
border: 1px solid rgba(108,142,255,0.4);
border-radius: 20px;
backdrop-filter: blur(12px);
box-shadow: 0 2px 12px rgba(108,142,255,0.15);
```

---

## 효과

| 효과 | 값 |
|------|-----|
| Glassmorphism | `backdrop-filter: blur(8–16px)` |
| 카드 그림자 | `0 2px 12px rgba(108,142,255,0.15)` |
| 모달 그림자 | `0 8px 40px rgba(0,0,0,0.4)` |
| 3D glow | `meshBasicMaterial color="#6C8EFF" opacity=0.3` |
