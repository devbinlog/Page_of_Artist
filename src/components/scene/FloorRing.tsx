import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function FloorRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    // Gentle pulse
    mat.opacity = 0.10 + Math.sin(clock.getElapsedTime() * 0.8) * 0.04
  })

  return (
    <group>
      {/* Main floor ring — RADIUS 3.8에 맞게 조정 */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.08, 0]}>
        <ringGeometry args={[3.55, 4.10, 128]} />
        <meshBasicMaterial
          color="#4F7DF3"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.07, 0]}>
        <ringGeometry args={[3.35, 3.55, 128]} />
        <meshBasicMaterial
          color="#7C9EFF"
          transparent
          opacity={0.10}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shadow ellipse under carousel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.09, 0]}>
        <circleGeometry args={[4.2, 64]} />
        <meshBasicMaterial
          color="#0a1628"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
