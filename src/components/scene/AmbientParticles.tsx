import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 캐러셀 주변을 떠다니는 ambient 파티클
// - 150개 Points (draw call 1개, instanced 없이도 충분한 성능)
// - 황금비(φ) 기반 결정론적 배치 — Math.random() 없음 (리렌더 안정)
// - 캐러셀 반지름(4.2) 바깥 영역에만 분포
const COUNT    = 150
const INNER_R  = 5.2    // 캐러셀 카드 바깥
const OUTER_R  = 9.0
const Y_RANGE  = 4.0
const PHI      = 1.6180339887  // 황금비

export function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  const { geometry, baseY, phases, speeds, amplitudes } = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3)
    const baseY      = new Float32Array(COUNT)
    const phases     = new Float32Array(COUNT)
    const speeds     = new Float32Array(COUNT)
    const amplitudes = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      // 황금비 시퀀스로 균일 분포 (클러스터링 없음)
      const angle = (i * PHI * 2 * Math.PI) % (Math.PI * 2)
      const t     = i / COUNT
      const r     = INNER_R + t * (OUTER_R - INNER_R)
      const y     = (((i * 0.293) % 1) * Y_RANGE) - Y_RANGE / 2

      positions[i * 3]     = Math.cos(angle) * r
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(angle) * r

      baseY[i]      = y
      phases[i]     = (i * PHI) % (Math.PI * 2)
      speeds[i]     = 0.15 + ((i * 0.137) % 0.35)
      amplitudes[i] = 0.08 + ((i * 0.211) % 0.22)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry: geo, baseY, phases, speeds, amplitudes }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const t   = clock.elapsedTime

    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] = baseY[i] + Math.sin(t * speeds[i] + phases[i]) * amplitudes[i]
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.038}
        color="#6C8EFF"
        transparent
        opacity={0.20}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
