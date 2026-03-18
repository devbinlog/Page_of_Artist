import { useEffect, useRef } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

// 모바일 스와이프 감지
// 캐러셀 좌우 이동에 사용
export function useSwipe({ onSwipeLeft, onSwipeRight }: SwipeHandlers, threshold = 50) {
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX
    }

    function onTouchEnd(e: TouchEvent) {
      if (touchStartX.current === null) return

      const delta = e.changedTouches[0].clientX - touchStartX.current
      touchStartX.current = null

      if (Math.abs(delta) < threshold) return

      if (delta < 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, threshold])
}

// 마우스 흔들기 감지 (데스크탑)
// 빠른 좌우 이동을 캐러셀 이동으로 변환
export function useMouseShake({ onShakeLeft, onShakeRight }: {
  onShakeLeft?: () => void
  onShakeRight?: () => void
}) {
  const lastX = useRef(0)
  const velocity = useRef(0)
  const cooldown = useRef(false)

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const dx = e.clientX - lastX.current
      lastX.current = e.clientX

      // 속도 누적 (스무딩)
      velocity.current = velocity.current * 0.8 + dx * 0.2

      if (cooldown.current) return

      if (velocity.current > 15) {
        cooldown.current = true
        onShakeRight?.()
        setTimeout(() => { cooldown.current = false }, 500)
        velocity.current = 0
      } else if (velocity.current < -15) {
        cooldown.current = true
        onShakeLeft?.()
        setTimeout(() => { cooldown.current = false }, 500)
        velocity.current = 0
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [onShakeLeft, onShakeRight])
}
