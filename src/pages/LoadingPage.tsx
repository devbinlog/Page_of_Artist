import { Canvas } from '@react-three/fiber'
import { VinylRecord } from '@/components/vinyl/VinylRecord'
import { MusicElements } from '@/components/scene/MusicElements'
import { SceneBackground } from '@/components/scene/SceneBackground'
import { useStore } from '@/store/useStore'

// 로딩 페이지 — 다크 글래스모피즘 테마
export function LoadingPage() {
  const loadingProgress = useStore((s) => s.loadingProgress)

  return (
    <div style={{ width: '100%', height: '100%', background: '#0d0d1a' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#0d0d1a']} />
        <SceneBackground />
        <MusicElements />
        <VinylRecord progress={loadingProgress} />
      </Canvas>

      <div style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        fontSize: 11,
        color: '#8892B0',
        fontFamily: 'sans-serif',
      }}>
        Data provided by Spotify
      </div>
    </div>
  )
}
