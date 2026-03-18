import { useRef, useEffect } from 'react'

interface TiltState {
  x: number
  y: number
}

// 모바일 자이로스코프 인터랙션
// useMouseTilt과 동일한 output interface로 통일하여 컴포넌트에서 교체 가능
export function useGyroscope(strength = 0.06) {
  const tiltRef = useRef<TiltState>({ x: 0, y: 0 })
  const isSupported = useRef(false)

  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined') return

    function onDeviceOrientation(e: DeviceOrientationEvent) {
      if (e.beta === null || e.gamma === null) return

      isSupported.current = true

      // beta: 앞뒤 기울기 (-180 ~ 180), gamma: 좌우 기울기 (-90 ~ 90)
      // 자연스러운 범위로 클램프 후 정규화
      const clampedGamma = Math.max(-45, Math.min(45, e.gamma))
      const clampedBeta = Math.max(-45, Math.min(45, e.beta - 45)) // 세로 기준 보정

      tiltRef.current.x = (clampedGamma / 45) * strength
      tiltRef.current.y = -(clampedBeta / 45) * strength
    }

    // iOS 13+ 권한 요청
    if (
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === 'function'
    ) {
      const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as {
        requestPermission: () => Promise<string>
      }
      DeviceOrientationEventTyped.requestPermission()
        .then((permission) => {
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', onDeviceOrientation)
          }
        })
        .catch(console.error)
    } else {
      window.addEventListener('deviceorientation', onDeviceOrientation)
    }

    return () => window.removeEventListener('deviceorientation', onDeviceOrientation)
  }, [strength])

  return { tiltRef, isSupported }
}
