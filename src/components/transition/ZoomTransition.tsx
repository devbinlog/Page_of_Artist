import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'

// 줌 트랜지션 오버레이
// 갤러리 더블클릭 → 흰 화면으로 페이드 인 → 페이지 전환 → 페이드 아웃
// CSS transition 기반 — Three.js 렌더 루프 외부에서 처리
export function ZoomTransition() {
  const isTransitioning = useStore((s) => s.isTransitioning)
  const [opacity, setOpacity] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isTransitioning) {
      setVisible(true)
      // 다음 프레임에서 opacity 변경 (transition 동작을 위해)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setOpacity(1))
      })
    } else {
      setOpacity(0)
      const timer = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0d0d1a',
        opacity,
        transition: 'opacity 0.5s ease-in-out',
        zIndex: 100,
        pointerEvents: isTransitioning ? 'all' : 'none',
      }}
    />
  )
}
