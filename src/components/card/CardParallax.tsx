import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CardParallaxProps {
  children: React.ReactNode
  tiltRef: React.MutableRefObject<{ x: number; y: number }>
  // 이 레이어의 Z 깊이 (0 = 베이스, 클수록 앞으로 나옴)
  depth?: number
  // 패럴랙스 강도 (레이어마다 다르게 설정)
  parallaxStrength?: number
}

// 개별 레이어에 틸트 + 패럴랙스 효과를 적용하는 컨트롤러
// 카드 내부 각 레이어 컴포넌트를 이것으로 감싸서 사용
export function CardParallaxLayer({
  children,
  tiltRef,
  depth = 0,
  parallaxStrength = 0.05,
}: CardParallaxProps) {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return

    // 레이어 깊이에 따라 패럴랙스 이동량 차등 적용
    // 앞 레이어일수록 더 많이 이동 → 입체감
    const px = -tiltRef.current.x * parallaxStrength * (depth + 1)
    const py = -tiltRef.current.y * parallaxStrength * (depth + 1)

    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, px, 0.1)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, py, 0.1)
  })

  return <group ref={ref}>{children}</group>
}

interface CardTiltControllerProps {
  children: React.ReactNode
  tiltRef: React.MutableRefObject<{ x: number; y: number }>
  maxTilt?: number  // 최대 틸트 각도 (라디안)
}

// 카드 전체를 틸트시키는 컨트롤러
// CardParallaxLayer 들을 이것으로 감싸서 사용
export function CardTiltController({
  children,
  tiltRef,
  maxTilt = 0.2,
}: CardTiltControllerProps) {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return

    // 마우스 위치에 따라 카드 전체 기울이기
    const targetRotX = tiltRef.current.y * maxTilt
    const targetRotY = tiltRef.current.x * maxTilt

    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.08)
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.08)
  })

  return <group ref={ref}>{children}</group>
}
