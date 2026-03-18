import { useRef, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { CARD_W, CARD_H } from './CardFront'
import type { Artist } from '@/types/artist'
import { CardFront } from './CardFront'
import { CardBack } from './CardBack'
import { CardTiltController } from './CardParallax'
import { useMouseTilt } from '@/hooks/useMouseTilt'
import { useGyroscope } from '@/hooks/useGyroscope'

interface ArtistCardProps {
  artist: Artist
  mode?: 'gallery' | 'detail'
  onClick?: () => void
  onDoubleClick?: () => void
  position?: [number, number, number]
  scale?: number
}

export function ArtistCard({
  artist,
  mode = 'gallery',
  onClick,
  onDoubleClick,
  position = [0, 0, 0],
  scale = 1,
}: ArtistCardProps) {
  const outerRef = useRef<THREE.Group>(null)
  const flipGroupRef = useRef<THREE.Group>(null)

  const [isFlipped, setIsFlipped] = useState(false)
  const isFlippedRef = useRef(false)
  // Spring-based flip (stiffness=180, damping=22)
  const flipPosRef = useRef(0)
  const flipVelRef = useRef(0)

  const [showFront, setShowFront] = useState(true)
  const showFrontTrackerRef = useRef(true)

  const floatPhaseRef = useRef(Math.random() * Math.PI * 2)
  const floatSpeedRef = useRef(0.35 + Math.random() * 0.45)
  const floatAmplitudeRef = useRef(0.10 + Math.random() * 0.14)

  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isMobile = /Mobi|Android/i.test(navigator.userAgent)
  const { tiltRef: mouseTiltRef } = useMouseTilt(mode === 'detail' ? 0.1 : 0.05)
  const { tiltRef: gyroTiltRef } = useGyroscope(mode === 'detail' ? 0.08 : 0.04)
  const activeTiltRef = isMobile ? gyroTiltRef : mouseTiltRef


  function flip(value: boolean) {
    isFlippedRef.current = value
    setIsFlipped(value)
  }

  useFrame(({ clock }, delta) => {
    // 갤러리 모드: 위아래 부유
    if (outerRef.current && mode === 'gallery') {
      outerRef.current.position.y =
        position[1] +
        Math.sin(clock.elapsedTime * floatSpeedRef.current + floatPhaseRef.current) *
        floatAmplitudeRef.current
    }

    if (!flipGroupRef.current) return

    // ── Spring flip 애니메이션 ─────────────────────────────────────────
    // F = k*(target - x) - d*v  →  stiffness=180, damping=22
    const target = isFlippedRef.current ? Math.PI : 0
    const cdt = Math.min(delta, 0.05)  // 50ms 초과 프레임 방지
    const force = 180 * (target - flipPosRef.current) - 22 * flipVelRef.current
    flipVelRef.current += force * cdt
    flipPosRef.current += flipVelRef.current * cdt
    flipGroupRef.current.rotation.y = flipPosRef.current

    // ── front/back 판정 (spring 각도 기반) ───────────────────────────
    // cos(rotation.y) > 0 → 앞면이 카메라 방향, < 0 → 뒷면
    const newShowFront = Math.cos(flipPosRef.current) > 0

    if (newShowFront !== showFrontTrackerRef.current) {
      showFrontTrackerRef.current = newShowFront
      setShowFront(newShowFront)
    }
  })

  function handleClick() {
    if (mode === 'detail') {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      clickTimerRef.current = setTimeout(() => {
        flip(!isFlippedRef.current)
        onClick?.()
        clickTimerRef.current = null
      }, 180)
    } else {
      onClick?.()
    }
  }

  function handleDoubleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()

    if (mode === 'detail') {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
        clickTimerRef.current = null
      }
      if (isFlippedRef.current) {
        flip(false)
      } else {
        onDoubleClick?.()
      }
    } else {
      onDoubleClick?.()
    }
  }

  return (
    <group ref={outerRef} position={position} scale={scale}>
      <CardTiltController
        tiltRef={activeTiltRef}
        maxTilt={mode === 'detail' ? 0.25 : 0.12}
      >
        <group
          ref={flipGroupRef}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          {showFront && (
            <CardFront
              artistName={artist.name}
              genres={artist.genres}
              imageUrl={artist.imageUrl}
              featuredTrackName={artist.featuredTrack.name}
              featuredTrackYoutubeUrl={artist.featuredTrack.youtubeUrl}
              albumImageUrl={artist.featuredAlbum.imageUrl}
              tiltRef={activeTiltRef}
            />
          )}

          {!showFront && (
            <group rotation={[0, Math.PI, 0]}>
              <CardBack
                albumName={artist.featuredAlbum.name}
                albumYoutubeUrl={artist.albumYoutubeUrl}
                albumImageUrl={artist.featuredAlbum.imageUrl}
                imageUrl={artist.imageUrl}
                tracks={artist.featuredAlbum.tracks}
              />
            </group>
          )}

          {/* 카드 외곽 glow 테두리 */}
          <RoundedBox args={[CARD_W + 0.08, CARD_H + 0.08, 0.02]} radius={0.13} smoothness={4} position={[0, 0, -0.002]}>
            <meshBasicMaterial color="#6C8EFF" transparent opacity={0.3} />
          </RoundedBox>

          {/* detail 모드 강조 glow */}
          {mode === 'detail' && (
            <RoundedBox args={[CARD_W + 0.12, CARD_H + 0.12, 0.01]} radius={0.14} smoothness={4} position={[0, 0, -0.004]}>
              <meshBasicMaterial color="#3B6AFF" transparent opacity={0.18} />
            </RoundedBox>
          )}
        </group>
      </CardTiltController>
    </group>
  )
}
