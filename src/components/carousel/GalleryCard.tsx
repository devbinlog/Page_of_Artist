import { useRef, useState, useEffect } from 'react'
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
  const tex    = useTextureSafe(artist.imageUrl || '')
  const Z      = 0.05
  const BOTTOM = -GC_H / 2  // -1.05

  // ── 정사각형 이미지 영역 (비율 고정)
  const IMG_SIZE = 0.92                             // 정사각형 고정
  const IMG_Y    = GC_H / 2 - IMG_SIZE / 2 - 0.11  // 상단에서 살짝 띄움
  const BEL      = IMG_Y - IMG_SIZE / 2             // 이미지 하단

  // center-crop: 이미지 비율에 따라 텍스처 repeat/offset 조정 → 늘어남 방지
  useEffect(() => {
    if (!tex) return
    const img = tex.image as HTMLImageElement | HTMLCanvasElement
    const w = (img as HTMLImageElement).naturalWidth  ?? (img as HTMLCanvasElement).width  ?? 0
    const h = (img as HTMLImageElement).naturalHeight ?? (img as HTMLCanvasElement).height ?? 0
    if (!w || !h || w === h) return
    const aspect = w / h
    if (aspect > 1) {
      // 가로가 더 긴 이미지: 좌우 크롭
      tex.repeat.set(1 / aspect, 1)
      tex.offset.set((1 - 1 / aspect) / 2, 0)
    } else {
      // 세로가 더 긴 이미지: 상하 크롭
      tex.repeat.set(1, aspect)
      tex.offset.set(0, (1 - aspect) / 2)
    }
    tex.needsUpdate = true
  }, [tex])

  const genres    = artist.genres.slice(0, 2).map(g => g.toUpperCase()).join(' · ')
  const trackName = artist.featuredTrack?.name || ''
  const albumName = artist.featuredAlbum?.name || ''

  return (
    <group>
      {/* ── 이미지 테두리 (이미지보다 약간 큰 파란 테두리) ── */}
      <mesh position={[0, IMG_Y, Z - 0.003]} renderOrder={1}>
        <planeGeometry args={[IMG_SIZE + 0.062, IMG_SIZE + 0.062]} />
        <meshBasicMaterial color="#3B6AFF" transparent opacity={0.45} />
      </mesh>

      {/* ── 아티스트 이미지 (정사각형 고정) ── */}
      <mesh position={[0, IMG_Y, Z]} renderOrder={2}>
        <planeGeometry args={[IMG_SIZE, IMG_SIZE]} />
        {tex
          ? <meshBasicMaterial key="img-on"  map={tex}  color="#ffffff" />
          : <meshBasicMaterial key="img-off" color="#1a2e54" />
        }
      </mesh>

      {/* ── Info 배경 (카드 라운드 코너 안쪽에 맞게 크기 조정) ── */}
      <mesh position={[0, BEL - 0.50, Z - 0.002]} renderOrder={1}>
        <planeGeometry args={[GC_W - 0.16, 0.90]} />
        <meshBasicMaterial color="#07152b" transparent opacity={0.72} />
      </mesh>

      {/* ── 아티스트명 ── */}
      <Text font={FONT_DISPLAY} sdfGlyphSize={128}
        position={[-GC_W / 2 + 0.10, BEL - 0.165, Z + 0.002]}
        fontSize={0.118} letterSpacing={-0.01}
        color="#FFFFFF" anchorX="left" anchorY="middle"
        maxWidth={GC_W - 0.16}
      >{artist.name}</Text>

      {/* ── 장르 행 ── */}
      <Text font={FONT_LABEL} sdfGlyphSize={64}
        position={[-GC_W / 2 + 0.10, BEL - 0.295, Z + 0.002]}
        fontSize={0.047} letterSpacing={0.05}
        color="#6C9AFF" anchorX="left" anchorY="middle"
        maxWidth={GC_W - 0.16}
      >{genres}</Text>

      {/* ── 대표 트랙 ── */}
      <Text font={FONT_BODY} sdfGlyphSize={64}
        position={[-GC_W / 2 + 0.10, BEL - 0.380, Z + 0.002]}
        fontSize={0.056} letterSpacing={0.01}
        color="#8CB6E0" anchorX="left" anchorY="middle"
        maxWidth={GC_W - 0.46}
      >{trackName ? `♪  ${trackName}` : ''}</Text>

      {/* ── 재생 버튼 (클릭 → YouTube) ── */}
      <mesh
        position={[GC_W / 2 - 0.215, BEL - 0.380, Z + 0.002]}
        onClick={(e) => {
          e.stopPropagation()
          const url = artist.featuredTrack?.youtubeUrl || artist.albumYoutubeUrl
          if (url) window.open(url, '_blank', 'noopener')
        }}
        onPointerEnter={() => { document.body.style.cursor = 'pointer' }}
        onPointerLeave={() => { document.body.style.cursor = '' }}
      >
        <circleGeometry args={[0.080, 32]} />
        <meshBasicMaterial color="#3B6AFF" transparent opacity={0.90} />
      </mesh>
      <Text font={FONT_LABEL} sdfGlyphSize={128}
        position={[GC_W / 2 - 0.215, BEL - 0.380, Z + 0.004]}
        fontSize={0.060} color="#FFFFFF" anchorX="center" anchorY="middle"
        onClick={(e) => {
          e.stopPropagation()
          const url = artist.featuredTrack?.youtubeUrl || artist.albumYoutubeUrl
          if (url) window.open(url, '_blank', 'noopener')
        }}
      >{'▶'}</Text>

      {/* ── 구분선 (재생 버튼에서 충분히 떨어짐) ── */}
      <mesh position={[0, BEL - 0.490, Z + 0.002]}>
        <planeGeometry args={[GC_W - 0.22, 0.003]} />
        <meshBasicMaterial color="#4F7DF3" transparent opacity={0.24} />
      </mesh>

      {/* ── ALBUM 라벨 + 앨범명 ── */}
      <Text font={FONT_LABEL} sdfGlyphSize={64}
        position={[-GC_W / 2 + 0.10, BEL - 0.590, Z + 0.002]}
        fontSize={0.042} letterSpacing={0.11}
        color="#4F7DF3" anchorX="left" anchorY="middle"
      >{'ALBUM'}</Text>
      <Text font={FONT_DISPLAY} sdfGlyphSize={128}
        position={[-GC_W / 2 + 0.10, BEL - 0.715, Z + 0.002]}
        fontSize={0.080} letterSpacing={-0.01}
        color="#C8DEFF" anchorX="left" anchorY="middle"
        maxWidth={GC_W - 0.16}
      >{albumName}</Text>

      {/* ── Flip 힌트 ── */}
      <Text font={FONT_LABEL} sdfGlyphSize={64}
        position={[0, BOTTOM + 0.100, Z + 0.003]}
        fontSize={0.036} letterSpacing={0.08}
        color="#2E4A72" anchorX="center" anchorY="middle"
      >{'FLIP FOR TRACKLIST'}</Text>

      {/* 하단 액센트 */}
      <mesh position={[0, BOTTOM + 0.026, Z]}>
        <planeGeometry args={[GC_W - 0.04, 0.044]} />
        <meshBasicMaterial color="#3B6AFF" transparent opacity={0.55} />
      </mesh>
    </group>
  )
}

// ─── Card Back ────────────────────────────────────────────
function CardBackContent({ artist }: { artist: Artist }) {
  // 뒷면: 앨범 커버 우선, 실패 시 아티스트 사진으로 폴백
  const tex = useTextureSafe(artist.featuredAlbum?.imageUrl || artist.imageUrl || '')
  const Z = 0.05
  const BOTTOM = -GC_H / 2  // -1.05

  // 이미지 center-crop (비율 유지)
  useEffect(() => {
    if (!tex) return
    const img = tex.image as HTMLImageElement | HTMLCanvasElement
    const w = (img as HTMLImageElement).naturalWidth  ?? (img as HTMLCanvasElement).width  ?? 0
    const h = (img as HTMLImageElement).naturalHeight ?? (img as HTMLCanvasElement).height ?? 0
    if (!w || !h || w === h) return
    const aspect = w / h
    if (aspect > 1) {
      tex.repeat.set(1 / aspect, 1)
      tex.offset.set((1 - 1 / aspect) / 2, 0)
    } else {
      tex.repeat.set(1, aspect)
      tex.offset.set(0, (1 - aspect) / 2)
    }
    tex.needsUpdate = true
  }, [tex])

  const ART   = 0.80
  const ART_Y = GC_H / 2 - ART / 2 - 0.14        // 상단에서 살짝 띄움 (앞면과 동일 간격)
  const BEL_A = ART_Y - ART / 2

  const tracks = (artist.featuredAlbum?.tracks || []).slice(0, 5)
  const hasMore = (artist.featuredAlbum?.tracks?.length ?? 0) > 5

  // 앨범명 ↔ 구분선 간격 확보
  const TY0 = BEL_A - 0.34

  return (
    <group>
      {/* ── Top accent bar ── */}
      <mesh position={[0, GC_H / 2 - 0.07, Z]}>
        <planeGeometry args={[GC_W - 0.20, 0.016]} />
        <meshBasicMaterial color="#4F7DF3" transparent opacity={0.70} />
      </mesh>

      {/* ── 아티스트 이미지 (정사각형, center-crop) ── */}
      <mesh position={[0, ART_Y, Z]} renderOrder={2}>
        <planeGeometry args={[ART, ART]} />
        {tex
          ? <meshBasicMaterial key="back-img-on"  map={tex}  color="#ffffff" />
          : <meshBasicMaterial key="back-img-off" color="#162b52" />
        }
      </mesh>
      {/* 이미지 테두리 */}
      <mesh position={[0, ART_Y, Z - 0.003]} renderOrder={1}>
        <planeGeometry args={[ART + 0.055, ART + 0.055]} />
        <meshBasicMaterial color="#3B6AFF" transparent opacity={0.40} />
      </mesh>

      {/* ── 앨범명 (이미지 하단에서 살짝 띄움) ── */}
      <Text font={FONT_DISPLAY} sdfGlyphSize={128}
        position={[0, BEL_A - 0.13, Z]}
        fontSize={0.082} letterSpacing={0.00}
        color="#FFFFFF" anchorX="center" anchorY="middle"
        maxWidth={GC_W - 0.12}
      >{artist.featuredAlbum?.name || ''}</Text>

      {/* ── 구분선 (앨범명에서 충분한 간격) ── */}
      <mesh position={[0, TY0 + 0.10, Z]}>
        <planeGeometry args={[GC_W - 0.20, 0.003]} />
        <meshBasicMaterial color="#4F7DF3" transparent opacity={0.30} />
      </mesh>

      {/* ── Track list (5 tracks) ── */}
      {tracks.map((track, i) => (
        <group key={i} position={[0, TY0 - i * 0.128, Z]}>
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

      {/* ── + More (트랙이 5개 초과일 때, 가운데 정렬) ── */}
      {hasMore && (
        <Text font={FONT_LABEL} sdfGlyphSize={64}
          position={[0, TY0 - tracks.length * 0.128, Z]}
          fontSize={0.048} letterSpacing={0.04}
          color="#4F7DF3" anchorX="center" anchorY="middle"
        >{'+ More'}</Text>
      )}

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

    // ── Back-face detection ──────────────────────────────────
    // Consider BOTH the carousel parent rotation AND the flip animation
    // so cards facing away from camera automatically show back content.
    const carouselRotY = outerRef.current.parent?.rotation.y ?? 0
    const effectiveRotY = carouselRotY + flipAnim.current
    const front = Math.cos(effectiveRotY) > 0
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
