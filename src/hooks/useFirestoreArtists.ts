import { useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useStore } from '@/store/useStore'
import type { Artist } from '@/types/artist'

// Firestore에서 승인된 아티스트를 실시간으로 불러와 Zustand artists에 병합
// Firebase 설정이 없으면 조용히 실패
export function useFirestoreArtists() {
  const setArtists = useStore((s) => s.setArtists)

  useEffect(() => {
    // Firebase projectId가 없으면 스킵
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) return

    try {
      // approved:true 인 아티스트만 조회
      const q = query(
        collection(db, 'artists'),
        where('approved', '==', true)
      )

      const unsubscribe = onSnapshot(q, (snap) => {
        const firestoreArtists: Artist[] = snap.docs.map((doc) => {
          const d = doc.data()
          return {
            id: doc.id,
            name: d.name ?? '',
            imageUrl: d.imageUrl ?? '',
            description: d.description ?? '',
            genres: d.genres ?? [],
            spotifyUrl: d.spotifyUrl ?? '',
            featuredAlbum: d.featuredAlbum ?? { id: '', name: '', imageUrl: '', tracks: [] },
            featuredTrack: d.featuredTrack ?? { name: '', youtubeUrl: '' },
            albumYoutubeUrl: d.albumYoutubeUrl ?? '',
            instagramUrl: d.instagramUrl ?? '',
          }
        })

        // stale closure 방지: getState()로 최신 artists 참조
        const currentArtists = useStore.getState().artists
        const currentIds = new Set(currentArtists.map((a) => a.id))
        const newOnes = firestoreArtists.filter((a) => !currentIds.has(a.id))
        if (newOnes.length > 0) {
          setArtists([...currentArtists, ...newOnes])
        }
      }, (err) => {
        console.warn('[useFirestoreArtists] Firestore read failed:', err.message)
      })

      return unsubscribe
    } catch {
      // Firebase 초기화 실패 (env 미설정) — 무시
    }
  }, [setArtists])
}
