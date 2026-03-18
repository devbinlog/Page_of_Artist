# Database & Authentication

## 개요

Firebase (Google)를 사용하며 두 가지 서비스를 활용합니다.

| 서비스 | 용도 |
|--------|------|
| **Firebase Firestore** | 아티스트 데이터 저장 (NoSQL) |
| **Firebase Authentication** | 사용자 로그인 (이메일+비밀번호) |

## Firebase 초기화

`src/lib/firebase.ts`

```ts
import { initializeApp } from 'firebase/app'
import { getFirestore }   from 'firebase/firestore'
import { getAuth }        from 'firebase/auth'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app  = initializeApp(firebaseConfig)
export const db   = getFirestore(app)
export const auth = getAuth(app)
```

## 환경변수 설정

프로젝트 루트에 `.env` 파일 생성 (`.env`는 gitignore에 포함됨):

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Firestore 컬렉션 구조

### `artists` 컬렉션

아티스트 데이터. 앱 시작 시 실시간 구독(`onSnapshot`).

```
artists/{artistId}
  ├── id:            string       (Spotify artist ID 또는 커스텀)
  ├── name:          string
  ├── genres:        string[]
  ├── imageUrl:      string       (아티스트 사진 URL)
  ├── description:   string
  ├── featuredTrack: {
  │     name:       string
  │     previewUrl: string | null
  │   }
  ├── featuredAlbum: {
  │     name:     string
  │     imageUrl: string
  │     tracks:   Array<{ number: number, name: string, durationMs: number }>
  │   }
  └── albumYoutubeUrl: string    (YouTube 앨범 링크)
```

### `users` 컬렉션

회원가입 시 생성. Firebase Auth UID를 문서 ID로 사용.

```
users/{uid}
  ├── uid:       string
  ├── nickname:  string
  ├── email:     string
  └── createdAt: Timestamp
```

## Firestore 사용 패턴

### 실시간 구독 (갤러리 페이지)

```ts
// src/hooks/useFirestoreArtists.ts
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

onSnapshot(collection(db, 'artists'), (snapshot) => {
  const artists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  setArtists(artists)
})
```

### 사용자 문서 저장 (회원가입)

```ts
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

await setDoc(doc(db, 'users', uid), {
  uid,
  nickname,
  email,
  createdAt: serverTimestamp(),
})
```

## Firebase Authentication

### 지원 로그인 방식

- **이메일 + 비밀번호** (Firebase Console → Authentication → 이메일/비밀번호 활성화 필요)

### 인증 흐름

```
회원가입:
  createUserWithEmailAndPassword(auth, email, password)
  → Firestore users/{uid} 문서 생성
  → setCurrentUser(user) → Zustand 상태 업데이트
  → navigate('/intro')

로그인:
  signInWithEmailAndPassword(auth, email, password)
  → setCurrentUser(user)
  → navigate('/intro')

앱 시작 시 상태 복원 (src/hooks/useAuth.ts):
  onAuthStateChanged(auth, (user) => setCurrentUser(user))
```

## Firebase Console 설정 체크리스트

- [ ] Firestore Database 생성 (프로덕션 모드 또는 테스트 모드)
- [ ] Authentication → 이메일/비밀번호 로그인 방식 활성화
- [ ] Firestore 보안 규칙 설정

### 권장 Firestore 보안 규칙

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 아티스트: 누구나 읽기, 인증된 사용자만 쓰기
    match /artists/{artistId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // 사용자 문서: 본인만 읽기/쓰기
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
