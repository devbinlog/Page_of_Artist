# Database Schema

Database: Firebase Firestore

---

## Collection: `artists`

### 문서 구조

```
artists/{artistId}

name              string       필수. 아티스트 활동명
genres            string[]     필수. 장르 배열 (소문자)
imageUrl          string       아티스트 대표 이미지 URL
description       string       아티스트 소개 (최대 300자)
spotifyUrl        string       Spotify 아티스트 페이지 URL
instagramUrl      string       Instagram 프로필 URL

featuredAlbum     object
  id              string       앨범 고유 ID
  name            string       앨범명
  imageUrl        string       앨범 커버 이미지 URL
  tracks          array
    number        number       트랙 번호
    name          string       트랙명

featuredTrack     object
  name            string       대표 트랙명
  youtubeUrl      string       YouTube 링크

albumYoutubeUrl   string       앨범 전체 YouTube 링크

approved          boolean      갤러리 노출 여부 (기본값: false)
createdAt         timestamp    등록 시각 (serverTimestamp)
```

---

## 예시 문서

```json
{
  "name": "LANY",
  "genres": ["indie pop", "synth-pop", "dream pop"],
  "imageUrl": "https://...",
  "description": "Los Angeles band known for dreamy synth-pop soundscapes.",
  "spotifyUrl": "https://open.spotify.com/artist/5IaHrOWFB1NfWsXFCDAsLc",
  "instagramUrl": "https://www.instagram.com/lanymusic",
  "featuredAlbum": {
    "id": "lany-mb",
    "name": "mama's boy",
    "imageUrl": "https://is1-ssl.mzstatic.com/...",
    "tracks": [
      { "number": 1, "name": "Thick and Thin" },
      { "number": 2, "name": "I Still Talk to Jesus" }
    ]
  },
  "featuredTrack": {
    "name": "ILYSB",
    "youtubeUrl": "https://www.youtube.com/watch?v=EAjMXFCd6dE"
  },
  "albumYoutubeUrl": "https://www.youtube.com/watch?v=...",
  "approved": true,
  "createdAt": "2024-06-01T00:00:00Z"
}
```

---

## Firestore 보안 규칙

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artists/{docId} {
      // 팬: approved=true인 아티스트만 읽기 가능
      allow read: if resource.data.approved == true;

      // 아티스트 등록: name, genres 필드 필수
      allow create: if request.resource.data.keys().hasAll(['name', 'genres'])
                    && request.resource.data.approved == false;

      // 관리자: 서버 사이드 또는 Admin SDK로 처리
      // allow update, delete: if isAdmin();
    }
  }
}
```

---

## 인덱스

Firestore 자동 인덱스 외에 추가로 필요한 복합 인덱스:

| 컬렉션 | 필드 1 | 필드 2 | 용도 |
|--------|--------|--------|------|
| artists | approved (asc) | createdAt (desc) | 대기 아티스트 목록 정렬 |
| artists | approved (asc) | genres (array) | 장르 필터 + 승인 여부 동시 쿼리 |

---

## 데이터 마이그레이션 노트

정적 데이터(`staticArtists.ts`)의 아티스트들은 Firestore에 저장되지 않는다.
Firestore는 **사용자가 등록한 신규 아티스트**만 저장한다.

두 소스를 `useFirestoreArtists` 훅에서 병합:
```
최종 artists = STATIC_ARTISTS + Firestore(approved=true)
중복 제거: artist.id 기준
```
