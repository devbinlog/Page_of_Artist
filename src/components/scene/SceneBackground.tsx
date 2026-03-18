import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMouseTilt, lerpTilt } from '@/hooks/useMouseTilt'

// 씬 조명 + (옵션) 카메라 lag 효과
// cameraControl={false} 시 카메라 이동 없이 조명만 제공 (ExhibitionCamera와 함께 사용)
export function SceneBackground({ cameraControl = true }: { cameraControl?: boolean }) {
  const { camera } = useThree()
  const { tiltRef, smoothRef } = useMouseTilt(0.04)

  const camOrigin = useRef(new THREE.Vector3(0, 0, 5))

  useFrame(() => {
    if (!cameraControl) return
    lerpTilt(smoothRef.current, tiltRef.current, 0.04)

    camera.position.x = camOrigin.current.x + smoothRef.current.x * 0.5
    camera.position.y = camOrigin.current.y + smoothRef.current.y * 0.5
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* 밝은 앰비언트 — 라이트 테마 */}
      <ambientLight intensity={1.2} color="#e8f0ff" />
      {/* 메인 디렉셔널 라이트 */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.6}
        color="#ffffff"
      />
      {/* 보조 디렉셔널 라이트 — 부드러운 파랑 */}
      <directionalLight
        position={[-5, -2, 3]}
        intensity={0.5}
        color="#aac4ff"
      />
      {/* 액센트 포인트 라이트 — 파란 glow */}
      <pointLight
        position={[0, 2, 4]}
        intensity={0.8}
        color="#6699ff"
      />
      {/* 하단 컬러 라이트 — 연한 청록 */}
      <pointLight
        position={[0, -3, 3]}
        intensity={0.4}
        color="#88ccff"
      />
    </>
  )
}
