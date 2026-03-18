import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useStore } from '@/store/useStore'

// 앱 최상위에서 한 번 마운트 — Firebase Auth 상태 변화를 Zustand에 동기화
export function useAuth() {
  const setCurrentUser = useStore((s) => s.setCurrentUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return unsubscribe
  }, [setCurrentUser])
}
