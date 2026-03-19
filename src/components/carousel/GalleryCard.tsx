import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import type { Artist } from '@/types/artist'
import { useTextureSafe } from '@/hooks/useTextureSafe'

// ─── Spec dimensions ─────────────────────────────────────
export const GC_W = 1.4
export const GC_H = 2.1
export const GC_T = 0.04
export const GC_R = 0.08

const FONT_DISPLAY = '/Playfair-Bold.ttf'
const FONT_LABEL   = '/Montserrat-SemiBold.ttf'
const FONT_BODY    = '/Montserrat-Regular.ttf'

// ─── Visual targets per state ────────────────────────────
export type GalleryCardState = 'active' | 'neighbor' | 'background'

const ST = {
  active:     { scale: 1.00, glow: 0.40 },
  neighbor:   { scale: 0.82, glow: 0.12 },
  background: { scale: 0.65, glow: 0.05 },
} as const

// ─── Card Front ───────────────────────────────────────────
function CardFrontContent({ artist }: { artist: Artist }) {
  const tex = useTextureSafe(artist.imageUrl || '')
  const Z = 0.05
  const BOTTOM = -GC_H / 2  // -1.05

  // Image: 48% of card height, flush to top
  const IMG_H = GC_H * 0.48          // 1.008
  const IMG_Y = GC_H / 2 - IMG_H / 2 - 0.01   // 0.536
  const BEL   = IMG_Y - IMG_H / 2    // 0.032  (just below image)

  const genre      = (artist.genres[0] || 'MUSIC').toUpperCase().slice(0, 10)
  const trackName  = artist.featuredTrack?.name || ''
  const albumName  = artist.featuredAlbum?.name || ''

  return (
    <group>
      {/* ── Artist image (single material — avoids remount on load) ── */}
      <mesh position={[0, IMG_Y, Z]}>
        <planeGeometry args={[GC_W - 0.04, IMG_H]} />
        <meshBasicMaterial
          map={tex ?? undefined}
          color={tex ? '#ffffff' : '#1a2e54'}
        />
      </mesh>

      {/* Genre badge */}
      <mesh position={[-GC_W / 2 + 0.215, IMG_Y + IMG_H / 2 - 0.125, Z + 0.002]}>
        <planeGeometry args={[0.37, 0.115]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.92} />
      </mesh>
      <Text font={FONT_LABEL} sdfGlyphSize={64}
        position={[-GC_W / 2 + 0.215, IMG_Y + IMG_H / 2 - 0.125, Z + 0.004]}
        fontSize={0.044} letterSpacing={0.07}
        color="#3B6AFF" anchorX="center" anchorY="middle"
      >{genre}</Text>

      {/* ── Artist name ── */}
      <Text font={FONT_DISPLAY} sdfGlyphSize={128}
        position={[-GC_W / 2 + 0.10, BEL - 0.14, Z]}
        fontSize={0.115} letterSpacing={-0.01}
        color="#FFFFFF" anchorX="left" anchorY="middle"
        maxWidth={GC_W - 0.16}
      >{artist.name}</Text>

      {/* ── Featured track + play button ── */}
      <Text font={FONT_BODY} sdfGlyphSize={64}
        position={[-GC_W / 2 + 0.10, BEL - 0.30, Z]}
        fontSize={0.058} letterSpacing={0.01}
        color="#8CB6E0" anchorX="left" anchorY="middle"
        maxWidth={GC_W - 0.42}
      >{trackName ? `♪  ${trackName}` : ''}</Text>

      {/* Play circle */}
      <mesh position={[GC_W / 2 - 0.165, BEL - 0.30, Z]}>
        <circleGeometry args={[0.082, 32]} />
        <meshBasicMaterial color="#3B6AFF" transparent opacity={0.90} />
      </mesh>
      <Text font={FONT_LABEL} sdfGlyphSize={64}
        position={[GC_W / 2 - 0.158, BEL - 0.30, Z + 0.002]}
        fontSize={0.068} color="#FFFFFF" anchorX="center" anchorY="middle"
      >{'▶'}</Text>

      {/* ── Thin separator ── */}
      <mesh position={[0, BEL - 0.44, Z]}>
        <planeGeometry args={[GC_W - 0.20, 0.003]} />
        <meshBasicMaterial color="#4F7DF3" transparent opacity={0.22} />
      </mesh>

      {/* ── Album panel background ── */}
      <mesh position={[0, BEL - 0.78, Z - 0.002]}>
        <planeGeometry args={[GC_W - 0.04, 0.60]} />
        <meshBasicMaterial color="#071224" transparent opacity={0.60} />
      </mesh>

      {/* "ALBUM" label */}
      <Text font={FONT_LABEL} sdfGlyphSize={64}
        position={[-GC_W / 2 + 0.10, BEL - 0.57, Z + 0.002]}
        fontSize={0.044} letterSpacing={0.10}
        color="#4F7DF3" anchorX="left" anchorY="middle"
      >{'ALBUM'}</Text>

      {/* Album name */}
      <Text font={FONT_DISPLAY} sdfGlyphSize={128}
        position={[-GC_W / 2 + 0.10, BEL - 0.72, Z + 0.002]}
        fontSize={0.076} letterSpacing={-0.01}
        color="#C8DEFF" anchorX="left" anchorY="middle"
        maxWidth={GC_W - 0.16}
      >{albumName}</Text>

      {/* Flip hint */}
      <Text font={FONT_LABEL} sdfGlyphSize={64}
        position={[0, BOTTOM + 0.105, Z + 0.002]}
        fontSize={0.038} letterSpacing={0.08}
        color="#2E4A72" anchorX="center" anchorY="middle"
      >{'FLIP FOR TRACKLIST'}</Text>

      {/* Bottom accent strip */}
      <mesh position={[0, BOTTOM + 0.026, Z]}>
        <planeGeometry args={[GC_W - 0.04, 0.044]} />
        <meshBasicMaterial color="#3B6AFF" transparent opacity={0.55} />
      </mesh>
    </group>
  )
}

// ─── Card Back ────────────────────────────────────────────
function CardBackContent({ artist }: { artist: Artist }) {
  const albumTex = useTextureSafe(artist.featuredAlbum?.imageUrl || artist.imageUrl || '')
  const Z = 0.05
  const BOTTOM = -GC_H / 2  // -1.05

  const ART   = 0.72
  const ART_Y = GC_H / 2 - ART / 2 - 0.12   // 1.05 - 0.36 - 0.12 = 0.57
  const BEL_A = ART_Y - ART / 2              // 0.57 - 0.36 = 0.21

  const tracks = (artist.featuredAlbum?.tracks || []).slice(0, 5)

  // Track list starts just below album name
  const TY0 = BEL_A - 0.22    // 0.21 - 0.22 = -0.01

  return (
    <group>
      {/* ── Top accent bar ── */}
      <mesh position={[0, GC_H / 2 - 0.07, Z]}>
        <planeGeometry args={[GC_W - 0.20, 0.016]} />
        <meshBasicMaterial color="#4F7DF3" transparent opacity={0.70} />
      </mesh>

      {/* ── Album art ── */}
      <mesh position={[0, ART_Y, Z]}>
        <planeGeometry args={[ART, ART]} />
        <meshBasicMaterial
          map={albumTex ?? undefined}
          color={albumTex ? '#ffffff' : '#162b52'}
        />
      </mesh>

      {/* ── Album name ── */}
      <Text font={FONT_DISPLAY} sdfGlyphSize={128}
        position={[0, BEL_A - 0.09, Z]}
        fontSize={0.082} letterSpacing={0.00}
        color="#FFFFFF" anchorX="center" anchorY="middle"
        maxWidth={GC_W - 0.12}
      >{artist.featuredAlbum?.name || ''}</Text>

      {/* ── Divider ── */}
      <mesh position={[0, TY0 + 0.07, Z]}>
        <planeGeometry args={[GC_W - 0.20, 0.003]} />
        <meshBasicMaterial color="#4F7DF3" transparent opacity={0.30} />
      </mesh>

      {/* ── Track list (5 tracks) ── */}
      {tracks.map((track, i) => (
        <group key={i} position={[0, TY0 - i * 0.140, Z]}>
          <Text font={FONT_LABEL} sdfGlyphSize={64}
            position={[-GC_W / 2 + 0.12, 0, 0]}
            fontSize={0.050} letterSpacing={0.05}
            color="#4F7DF3" anchorX="left" anchorY="middle"
          >{String(track.number || i + 1).padStart(2, '0')}</Text>
          <Text font={FONT_BODY} sdfGlyphSize={64}
            position={[-GC_W / 2 + 0.26, 0, 0]}
            fontSize={0.062} letterSpacing={0.005}
            color="#D4E5FF" anchorX="left" anchorY="middle"
            maxWidth={GC_W - 0.34}
          >{track.name}</Text>
        </group>
      ))}

      {/* ── Open hint ── */}
      <Text font={FONT_LABEL} sdfGlyphSize={64}
        position={[0, BOTTOM + 0.105, Z]}
        fontSize={0.038} letterSpacing={0.08}
        color="#2E4A72" anchorX="center" anchorY="middle"
      >{'DBL CLICK TO OPEN'}</Text>

      {/* Bottom accent strip */}
      <mesh position={[0, BOTTOM + 0.026, Z]}>
        <planeGeometry args={[GC_W - 0.04, 0.044]} />
        <meshBasicMaterial color="#3B6AFF" transparent opacity={0.55} />
      </mesh>
    </group>
  )
}

// ─── Main GalleryCard ─────────────────────────────────────
interface GalleryCardProps {
  artist:        Artist
  cardState:     GalleryCardState
  isFlipped:     boolean
  floatSeed:     number
  onClick:       () => void
  onDoubleClick: () => void
}

export function GalleryCard({
  artist, cardState, isFlipped, floatSeed, onClick, onDoubleClick,
}: GalleryCardProps) {
  const outerRef  = useRef<THREE.Group>(null)
  const flipRef   = useRef<THREE.Group>(null)
  const glowRef   = useRef<THREE.Mesh>(null)

  const scaleAnim  = useRef<number>(ST[cardState].scale)
  const glowAnim   = useRef<number>(ST[cardState].glow)
  const flipAnim   = useRef(0)
  const tiltXAnim  = useRef(0)
  const pointerPos = useRef({ x: 0, y: 0 })

  const [showFront, setShowFront] = useState(true)
  const showFrontRef = useRef(true)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }, dt) => {
    if (!outerRef.current || !flipRef.current) return
    const cfg = ST[cardState]
    const safe = Math.min(dt, 0.033)

    // Scale lerp
    scaleAnim.current = THREE.MathUtils.lerp(scaleAnim.current, cfg.scale, 1 - Math.pow(0.04, safe))
    outerRef.current.scale.setScalar(scaleAnim.current)

    // Float
    const t = clock.getElapsedTime()
    outerRef.current.position.y =
      Math.sin(t * Math.PI * 2 * 0.6 + floatSeed * Math.PI * 2) * 0.03

    // Hover tilt (active card only)
    const isActive = cardState === 'active'
    const targetTX = hovered && isActive ? -pointerPos.current.y * 6 * (Math.PI / 180) : 0
    tiltXAnim.current = THREE.MathUtils.lerp(tiltXAnim.current, targetTX, 0.12)
    outerRef.current.rotation.x = tiltXAnim.current

    // Glow lerp
    if (glowRef.current) {
      glowAnim.current = THREE.MathUtils.lerp(glowAnim.current, cfg.glow, 0.08)
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = glowAnim.current
    }

    // Flip lerp
    const flipTarget = isFlipped ? Math.PI : 0
    flipAnim.current = THREE.MathUtils.lerp(flipAnim.current, flipTarget, 0.09)
    flipRef.current.rotation.y = flipAnim.current
    const front = Math.cos(flipAnim.current) > 0
    if (front !== showFrontRef.current) {
      showFrontRef.current = front
      setShowFront(front)
    }
  })

  return (
    <group ref={outerRef}>
      <group
        ref={flipRef}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick() }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => { setHovered(false); pointerPos.current = { x: 0, y: 0 } }}
        onPointerMove={(e) => {
          if (cardState !== 'active') return
          const obj = outerRef.current
          if (!obj) return
          const wp = new THREE.Vector3()
          obj.getWorldPosition(wp)
          pointerPos.current = {
            x: Math.max(-1, Math.min(1, (e.point.x - wp.x) / (GC_W * 0.5))),
            y: Math.max(-1, Math.min(1, (e.point.y - wp.y) / (GC_H * 0.5))),
          }
        }}
      >
        {/* Card body */}
        <RoundedBox args={[GC_W, GC_H, GC_T]} radius={GC_R} smoothness={4}>
          <meshStandardMaterial color="#0c1e40" roughness={0.38} metalness={0.10} />
        </RoundedBox>

        {/* Edge glow (BackSide) */}
        <RoundedBox
          ref={glowRef}
          args={[GC_W + 0.028, GC_H + 0.028, GC_T + 0.006]}
          radius={GC_R + 0.014}
          smoothness={4}
        >
          <meshBasicMaterial
            color="#6C9AFF"
            transparent
            opacity={ST[cardState].glow}
            side={THREE.BackSide}
          />
        </RoundedBox>

        {/* Front content */}
        {showFront && <CardFrontContent artist={artist} />}

        {/* Back content (mirrored) */}
        {!showFront && (
          <group rotation={[0, Math.PI, 0]}>
            <CardBackContent artist={artist} />
          </group>
        )}
      </group>
    </group>
  )
}
