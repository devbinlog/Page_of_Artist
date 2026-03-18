import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface TiltState {
  // 정규화된 마우스 위치 (-1 ~ 1)
  x: number
  y: number
}

interface UseMouseTiltReturn {
  tiltRef: React.MutableRefObject<TiltState>
  // 카메라 lag용 스무스 값 (useFrame에서 lerp 적용)
  smoothRef: React.MutableRefObject<TiltState>
}

// 마우스 이동을 정규화된 틸트 값으로 변환
// useFrame 루프에서 lerp로 부드럽게 처리
export function useMouseTilt(strength = 0.08): UseMouseTiltReturn {
  const tiltRef = useRef<TiltState>({ x: 0, y: 0 })
  const smoothRef = useRef<TiltState>({ x: 0, y: 0 })

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      // 화면 중앙 기준 -1 ~ 1 정규화
      tiltRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2 * strength
      tiltRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2 * strength
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [strength])

  return { tiltRef, smoothRef }
}

// useFrame 루프에서 카메라 lag 처리용 lerp 유틸
export function lerpTilt(
  smooth: TiltState,
  target: TiltState,
  factor = 0.05
) {
  smooth.x = THREE.MathUtils.lerp(smooth.x, target.x, factor)
  smooth.y = THREE.MathUtils.lerp(smooth.y, target.y, factor)
}
