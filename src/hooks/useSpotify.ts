import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { fetchArtists } from '@/services/artistService'
import { navigateTo } from '@/utils/navigationService'

export { searchArtists } from '@/services/artistService'

export function useSpotify() {
  const { setArtists, setLoadingProgress, setIsLoading } = useStore()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const total = 30
        let progress = 0
        // 로딩 프로그레스 시뮬레이션
        const ticker = setInterval(() => {
          progress = Math.min(progress + 1 / total, 0.95)
          setLoadingProgress(progress)
        }, 60)

        const artists = await fetchArtists()
        clearInterval(ticker)

        if (cancelled) return
        setLoadingProgress(1)
        setArtists(artists)
        setTimeout(() => {
          if (!cancelled) {
            setIsLoading(false)
            navigateTo('/intro')
          }
        }, 400)
      } catch {
        if (!cancelled) {
          setIsLoading(false)
          navigateTo('/intro')
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])
}
