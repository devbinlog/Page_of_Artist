import { useMemo } from 'react'
import * as THREE from 'three'

// 오선지 (5선지) — 화면 하단 고정
// 2D 평면 요소, 씬의 바닥에 배치
export function StaffLines({ yPosition = -3.2 }: { yPosition?: number }) {
  // 5개의 수평 선을 LineSegments로 렌더링
  // draw call 최소화를 위해 하나의 geometry로 통합
  const geometry = useMemo(() => {
    const points: number[] = []
    const lineSpacing = 0.12
    const width = 20  // 화면 너비보다 충분히 넓게

    for (let i = 0; i < 5; i++) {
      const y = i * lineSpacing
      points.push(-width / 2, y, 0, width / 2, y, 0)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geo
  }, [])

  return (
    <lineSegments geometry={geometry} position={[0, yPosition, -1]}>
      <lineBasicMaterial
        color="#7aacd8"
        transparent
        opacity={0.6}
      />
    </lineSegments>
  )
}
