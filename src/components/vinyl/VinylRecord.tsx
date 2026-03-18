import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface VinylRecordProps {
  progress: number  // 0~1 로딩 진행률
}

// 로딩 페이지 비닐 레코드
// - 레코드가 회전
// - 외곽 테두리가 progress에 따라 채워짐 (링 형태)
// - 드래그로 회전 속도 조작 가능
export function VinylRecord({ progress }: VinylRecordProps) {
  const groupRef = useRef<THREE.Group>(null)
  const rotationSpeedRef = useRef(0.008)   // 기본 회전 속도
  const isDraggingRef = useRef(false)
  const lastMouseXRef = useRef(0)

  // 진행률 링 (RingGeometry)
  const ringRef = useRef<THREE.Mesh>(null)

  // progress가 변할 때마다 링 geometry를 새로 생성
  // R3F는 geometry args를 초기값으로만 사용 → 명시적 교체 필요
  useEffect(() => {
    if (!ringRef.current) return
    const oldGeo = ringRef.current.geometry
    ringRef.current.geometry = new THREE.RingGeometry(1.52, 1.65, 64, 1, 0, progress * Math.PI * 2)
    oldGeo.dispose()
  }, [progress])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      isDraggingRef.current = true
      lastMouseXRef.current = e.clientX
    }
    function onMouseMove(e: MouseEvent) {
      if (!isDraggingRef.current) return
      const dx = e.clientX - lastMouseXRef.current
      rotationSpeedRef.current = THREE.MathUtils.clamp(dx * 0.001, -0.05, 0.05)
      lastMouseXRef.current = e.clientX
    }
    function onMouseUp() {
      isDraggingRef.current = false
      // 드래그 종료 후 기본 속도로 서서히 복귀
    }

    // 모바일 터치
    function onTouchStart(e: TouchEvent) {
      isDraggingRef.current = true
      lastMouseXRef.current = e.touches[0].clientX
    }
    function onTouchMove(e: TouchEvent) {
      if (!isDraggingRef.current) return
      const dx = e.touches[0].clientX - lastMouseXRef.current
      rotationSpeedRef.current = THREE.MathUtils.clamp(dx * 0.001, -0.05, 0.05)
      lastMouseXRef.current = e.touches[0].clientX
    }
    function onTouchEnd() {
      isDraggingRef.current = false
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  useFrame(() => {
    if (!groupRef.current) return

    // 드래그 종료 후 속도 감쇠
    if (!isDraggingRef.current) {
      rotationSpeedRef.current = THREE.MathUtils.lerp(
        rotationSpeedRef.current,
        0.008,
        0.03
      )
    }

    groupRef.current.rotation.z -= rotationSpeedRef.current
  })

  return (
    <group ref={groupRef}>
      {/* 레코드 본체 */}
      <mesh>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* 레코드 그루브 링들 */}
      {[0.6, 0.85, 1.1, 1.3].map((r, i) => (
        <mesh key={i} position={[0, 0, 0.001]}>
          <ringGeometry args={[r - 0.02, r, 64]} />
          <meshBasicMaterial color="#333333" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* 중심 레이블 */}
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#e8e0d0" />
      </mesh>

      {/* 진행률 링 (외곽) — useEffect에서 geometry 교체로 progress 반영 */}
      <mesh ref={ringRef} position={[0, 0, 0.003]}>
        <ringGeometry args={[1.52, 1.65, 64, 1, 0, 0]} />
        <meshBasicMaterial
          color="#5577ff"
          transparent
          opacity={0.3 + progress * 0.7}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* 로딩 텍스트 */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.2}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(progress * 100)}%
      </Text>
      <Text
        position={[0, -2.35, 0]}
        fontSize={0.13}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
      >
        Loading artists...
      </Text>
    </group>
  )
}
