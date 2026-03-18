import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

type LinkType = 'youtube' | 'spotify' | 'instagram'

// public/ 에 있는 실제 브랜드 아이콘 PNG
const ICON_SRC: Record<LinkType, string> = {
  youtube:   '/youtube.png',
  spotify:   '/spotify.png',
  instagram: '/instagram.png',
}

const FONT_BODY = '/Montserrat-Regular.ttf'

interface LinkCubeProps {
  type: LinkType
  url: string
  position: [number, number, number]
}

function useIconTexture(src: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null)
  useEffect(() => {
    if (!src) return
    let cancelled = false
    const loader = new THREE.TextureLoader()
    loader.load(src, (t) => {
      if (cancelled) return
      t.minFilter = THREE.LinearFilter
      t.generateMipmaps = false
      t.colorSpace = THREE.SRGBColorSpace
      setTex(t)
    }, undefined, () => {})
    return () => { cancelled = true }
  }, [src])
  return tex
}

export function LinkCube({ type, url, position }: LinkCubeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const floatPhase = useRef(Math.random() * Math.PI * 2)
  const iconTex = useIconTexture(ICON_SRC[type])

  // YouTube는 가로 비율, 나머지는 정사각형
  const W = type === 'youtube' ? 0.90 : 0.72
  const H = type === 'youtube' ? 0.64 : 0.72

  // 아이콘 미로드 시 브랜드 색상
  const BRAND_COLOR = type === 'youtube' ? '#FF0000' : type === 'spotify' ? '#1DB954' : '#E1306C'

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 1.2 + floatPhase.current) * 0.10

    const targetScale = hovered ? 1.20 : 1.0
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
    )
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default' }}
      onClick={(e) => { e.stopPropagation(); if (url) window.open(url, '_blank', 'noopener') }}
    >
      {/* 아이콘 — PNG 로드 시: 실제 브랜드 아이콘
                  transparent+alphaTest: 투명 배경 PNG → 아이콘 형태만 렌더링
                  로드 전: 브랜드 색상 플레이스홀더 */}
      {iconTex ? (
        <mesh>
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial map={iconTex} transparent alphaTest={0.05} />
        </mesh>
      ) : (
        <mesh>
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial color={BRAND_COLOR} transparent opacity={0.85} />
        </mesh>
      )}

      {/* 호버 glow */}
      {hovered && (
        <mesh position={[0, 0, -0.006]}>
          <planeGeometry args={[W + 0.14, H + 0.14]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.14} />
        </mesh>
      )}

      {/* 플랫폼 이름 */}
      <Text
        font={FONT_BODY}
        sdfGlyphSize={64}
        position={[0, -H / 2 - 0.14, 0.002]}
        fontSize={0.080}
        color={hovered ? '#ffffff' : '#8892B0'}
        anchorX="center"
        anchorY="middle"
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </group>
  )
}
