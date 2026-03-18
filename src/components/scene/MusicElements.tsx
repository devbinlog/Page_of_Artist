import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface MusicElementProps {
  symbol: string
  position: [number, number, number]
  speed: number       // 부유 속도
  amplitude: number   // 부유 진폭
  phase: number       // 위상 오프셋 (각 요소가 다른 타이밍에 움직이도록)
  fontSize: number
  rotation?: [number, number, number]
}

function MusicElement({ symbol, position, speed, amplitude, phase, fontSize, rotation }: MusicElementProps) {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    // 부드러운 sin 곡선으로 둥둥 떠다니는 효과
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * speed + phase) * amplitude
    ref.current.rotation.z = Math.sin(clock.elapsedTime * speed * 0.5 + phase) * 0.05
  })

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <Text
        fontSize={fontSize}
        color="#5580dd"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
    </group>
  )
}

// 씬에 배치되는 음악 요소들
// 너무 많지 않게 — 8개로 제한 (성능 고려)
// BMP 범위(U+0000~U+FFFF) 음악 기호만 사용 — Inter 폰트에서 렌더 보장
// SMP 범위 𝄞(U+1D11E) 𝄢(U+1D122) 𝄽(U+1D13D) 는 기본 폰트 미지원 → BMP 대체
const MUSIC_SYMBOLS = [
  { symbol: '♬', fontSize: 0.5 },  // 높은음자리표 대체 (연속 16분음표)
  { symbol: '♪', fontSize: 0.45 }, // 낮은음자리표 대체 (8분음표)
  { symbol: '♩', fontSize: 0.35 }, // 4분음표
  { symbol: '♫', fontSize: 0.3 },  // 연속 8분음표
  { symbol: '♬', fontSize: 0.35 }, // 연속 16분음표
  { symbol: '♭', fontSize: 0.4 },  // 플랫
  { symbol: '♯', fontSize: 0.35 }, // 샤프
  { symbol: '♮', fontSize: 0.3 },  // 자연표 (쉼표 대체)
]

export function MusicElements() {
  // 고정된 랜덤 배치 (리렌더 시 위치 변경 방지)
  const elements = useMemo(() => {
    return MUSIC_SYMBOLS.map((sym, i) => {
      // 결정론적 배치 — Math.random() 대신 index 기반 계산
      const angle = (i / MUSIC_SYMBOLS.length) * Math.PI * 2
      const radius = 3 + (i % 3) * 0.8
      return {
        ...sym,
        position: [
          Math.cos(angle) * radius,
          (i % 3) * 0.6 - 0.6,
          -0.5 - (i % 2) * 0.3,
        ] as [number, number, number],
        speed: 0.4 + (i % 4) * 0.15,
        amplitude: 0.08 + (i % 3) * 0.04,
        phase: (i / MUSIC_SYMBOLS.length) * Math.PI * 2,
        rotation: [0, 0, (i % 5 - 2) * 0.1] as [number, number, number],
      }
    })
  }, [])

  return (
    <group>
      {elements.map((el, i) => (
        <MusicElement key={i} {...el} />
      ))}
    </group>
  )
}
