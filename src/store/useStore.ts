import { create } from 'zustand'
import type { User as FirebaseUser } from 'firebase/auth'
import type { Artist } from '@/types/artist'

interface AppState {
  // ── 아티스트 데이터 ──────────────────────────────────
  artists: Artist[]
  setArtists: (artists: Artist[]) => void

  selectedArtist: Artist | null
  setSelectedArtist: (artist: Artist | null) => void

  // ── 로딩 상태 ────────────────────────────────────────
  isLoading: boolean
  loadingProgress: number
  setIsLoading: (loading: boolean) => void
  setLoadingProgress: (progress: number) => void

  // ── 검색 / 필터 ──────────────────────────────────────
  searchQuery: string
  setSearchQuery: (query: string) => void

  genreFilter: string
  setGenreFilter: (genre: string) => void

  // ── 페이지 전환 오버레이 ──────────────────────────────
  isTransitioning: boolean
  startTransition: (callback: () => void) => void

  // ── 캐러셀 포커스 ─────────────────────────────────────
  selectedCarouselIndex: number | null
  setSelectedCarouselIndex: (i: number | null) => void

  // ── 인증 ─────────────────────────────────────────────
  currentUser: FirebaseUser | null
  setCurrentUser: (user: FirebaseUser | null) => void
}

export const useStore = create<AppState>((set, get) => ({
  artists: [],
  setArtists: (artists) => set({ artists }),

  selectedArtist: null,
  setSelectedArtist: (artist) => set({ selectedArtist: artist }),

  isLoading: true,
  loadingProgress: 0,
  setIsLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  genreFilter: '',
  setGenreFilter: (genre) => set({ genreFilter: genre }),

  selectedCarouselIndex: null,
  setSelectedCarouselIndex: (i) => set({ selectedCarouselIndex: i }),

  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  isTransitioning: false,
  startTransition: (callback) => {
    if (get().isTransitioning) return
    set({ isTransitioning: true })
    setTimeout(() => {
      callback()
      setTimeout(() => set({ isTransitioning: false }), 500)
    }, 500)
  },
}))
