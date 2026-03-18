# Database & Authentication

## 개요

Firebase의 두 가지 서비스를 사용합니다.

| 서비스 | 역할 |
|--------|------|
| Firebase Firestore | 아티스트 데이터 NoSQL 저장소 — 실시간 구독 |
| Firebase Authentication | 이메일 + 비밀번호 기반 사용자 인증 |

---

## Firebase 초기화

`src/lib/firebase.ts`

```ts
import { initializeApp } from 'firebase/app'
import { getFirestore }  from 'firebase/firestore'
import { getAuth }       from 'firebase/auth'

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

모든 Firebase 키는 `.env` 파일로 관리하며 `VITE_` 접두사를 통해 Vite가 빌드 시 주입합니다.
`.env` 파일은 `.gitignore`에 포함되어 저장소에 커밋되지 않습니다.

---

## 환경변수

프로젝트 루트에 `.env` 파일을 생성합니다.

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Firestore 컬렉션 구조

### artists 컬렉션

앱의 핵심 데이터입니다. GalleryPage 진입 시 `onSnapshot`으로 실시간 구독을 시작하며
문서가 추가/수정/삭제되면 갤러리가 즉시 업데이트됩니다.

```
artists/{artistId}
  ├── id               string      Spotify artist ID 또는 커스텀 식별자
  ├── name             string      아티스트 이름
  ├── genres           string[]    장르 태그 배열 (소문자, 예: ["pop", "r&b"])
  ├── imageUrl         string      아티스트 사진 URL (CORS 허용 도메인 사용)
  ├── description      string      아티스트 소개 (1~2문장)
  ├── spotifyUrl       string      Spotify 아티스트 페이지 URL
  ├── instagramUrl     string      Instagram 프로필 URL
  ├── albumYoutubeUrl  string      대표 앨범 YouTube 링크
  │
  ├── featuredTrack
  │   ├── name         string      대표곡 이름
  │   └── youtubeUrl   string      대표곡 YouTube 링크
  │
  └── featuredAlbum
      ├── id           string      앨범 식별자
      ├── name         string      앨범 이름
      ├── imageUrl     string      앨범 커버 이미지 URL
      └── tracks       Array
          ├── number   number      트랙 번호
          └── name     string      트랙 이름
```

### users 컬렉션

회원가입 시 Firebase Auth UID를 문서 ID로 사용해 생성합니다.
인증 UID와 Firestore 문서 ID를 동일하게 유지해 보안 규칙 작성을 단순화했습니다.

```
users/{uid}
  ├── uid        string      Firebase Auth UID
  ├── nickname   string      사용자 닉네임
  ├── email      string      이메일 주소
  └── createdAt  Timestamp   가입 시각 (serverTimestamp())
```

---

## Firestore 사용 패턴

### 실시간 구독 — artists 컬렉션

`src/hooks/useFirestoreArtists.ts`

```ts
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useStore } from '@/store/useStore'

export function useFirestoreArtists() {
  const setArtists = useStore(s => s.setArtists)

  useEffect(() => {
    const q = query(collection(db, 'artists'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const artists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Artist))
      setArtists(artists)
    })
    return unsubscribe   // 컴포넌트 언마운트 시 구독 해제
  }, [])
}
```

### 사용자 문서 저장 — 회원가입

`src/pages/AuthPage.tsx`

```ts
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const { user } = await createUserWithEmailAndPassword(auth, email, password)

await setDoc(doc(db, 'users', user.uid), {
  uid:       user.uid,
  nickname,
  email,
  createdAt: serverTimestamp(),
})
```

---

## Firebase Authentication

### 인증 방식

이메일 + 비밀번호 인증 한 가지를 지원합니다.
Firebase Console → Authentication → 로그인 방법에서 활성화해야 합니다.

### 인증 흐름

```
회원가입
  createUserWithEmailAndPassword(auth, email, password)
    → Firestore users/{uid} 문서 생성
    → setCurrentUser(user) → Zustand store 업데이트
    → navigate('/intro')

로그인
  signInWithEmailAndPassword(auth, email, password)
    → setCurrentUser(user) → Zustand store 업데이트
    → navigate('/intro')

앱 시작 시 로그인 상태 복원 (src/hooks/useAuth.ts)
  onAuthStateChanged(auth, (user) => {
    setCurrentUser(user)
  })
```

### Firebase 에러 코드 한글 처리

```ts
function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use':   '이미 사용 중인 이메일입니다.',
    'auth/invalid-email':          '올바른 이메일 형식이 아닙니다.',
    'auth/weak-password':          '비밀번호는 6자 이상이어야 합니다.',
    'auth/user-not-found':         '존재하지 않는 계정입니다.',
    'auth/wrong-password':         '비밀번호가 올바르지 않습니다.',
    'auth/too-many-requests':      '잠시 후 다시 시도해 주세요.',
  }
  return messages[code] ?? '오류가 발생했습니다. 다시 시도해 주세요.'
}
```

---

## Firestore 보안 규칙

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // artists: 누구나 읽기 가능, 쓰기는 인증된 사용자만
    match /artists/{artistId} {
      allow read:  if true;
      allow write: if request.auth != null;
    }

    // users: 본인 문서만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

---

## Firebase Console 설정 체크리스트

- [ ] Firestore Database 생성 (프로덕션 모드)
- [ ] Authentication → 이메일/비밀번호 로그인 방식 활성화
- [ ] Firestore 보안 규칙 위 내용으로 적용
- [ ] `.env` 파일에 프로젝트 설정 값 입력
