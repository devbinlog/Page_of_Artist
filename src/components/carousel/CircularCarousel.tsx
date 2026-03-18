import { useRef, useEffect, useCallback, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import type { Artist } from '@/types/artist'
import { GalleryCard, GalleryCardState } from './GalleryCard'
import { useStore } from '@/store/useStore'
import { cameraDragState } from '@/utils/cameraState'

// ─── Spec constants ───────────────────────────────────────
const RADIUS           = 3.8
const MAX_CARDS        = 12
const DRAG_SENSITIVITY = 0.004
const SPRING_TENSION   = 170
const SPRING_FRICTION  = 26
const DRAG_THRESHOLD   = 5      // px before considered a drag

function wrap(i: number, n: number) {
  return ((i % n) + n) % n
}

interface CircularCarouselProps {
  artists:          Artist[]
  activeFlipped:    boolean
  onActiveChange:   (index: number, artist: Artist) => void
}

export function CircularCarousel({
  artists, activeFlipped, onActiveChange,
}: CircularCarouselProps) {
  const validArtists = artists
    .filter(a => a.name.trim() && a.genres.length > 0)
    .slice(0, MAX_CARDS)
  const N = validArtists.length
  const angleStep = N > 0 ? (Math.PI * 2) / N : 0

  const { gl } = useThree()
  const navigate = useNavigate()
  const { setSelectedArtist } = useStore()

  // ── Spring state (all in refs — no React re-renders for rotation) ──
  const springPos    = useRef(0)
  const springVel    = useRef(0)
  const springTarget = useRef(0)

  // ── Active index ──
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const lastCommitted  = useRef(-1)

  // ── Per-card group refs (positions updated imperatively in useFrame) ──
  const cardGroupRefs = useRef<(THREE.Group | null)[]>([])

  // ── Drag state ──
  const isDragging   = useRef(false)
  const dragStartX   = useRef(0)
  const dragStartRot = useRef(0)
  const hasDragged   = useRef(false)

  // ── Snap to index i ──────────────────────────────────────
  const goToIndex = useCallback((i: number) => {
    const cur = activeIndexRef.current
    const fwd = wrap(i - cur, N)
    const bwd = N - fwd
    if (fwd <= bwd) {
      springTarget.current -= fwd * angleStep
    } else {
      springTarget.current += bwd * angleStep
    }
    activeIndexRef.current = i
    setActiveIndex(i)
    if (validArtists[i]) onActiveChange(i, validArtists[i])
  }, [N, angleStep, validArtists, onActiveChange])

  const goNext = useCallback(() => {
    goToIndex(wrap(activeIndexRef.current + 1, N))
  }, [goToIndex, N])

  const goPrev = useCallback(() => {
    goToIndex(wrap(activeIndexRef.current - 1, N))
  }, [goToIndex, N])

  // Keep latest callbacks accessible in DOM handlers
  const goNextRef = useRef(goNext)
  const goPrevRef = useRef(goPrev)
  useEffect(() => { goNextRef.current = goNext }, [goNext])
  useEffect(() => { goPrevRef.current = goPrev }, [goPrev])

  // ── DOM event handlers ────────────────────────────────────
  useEffect(() => {
    if (N === 0) return
    const canvas = gl.domElement

    function onPointerDown(e: PointerEvent) {
      isDragging.current   = true
      hasDragged.current   = false
      dragStartX.current   = e.clientX
      dragStartRot.current = springTarget.current
      cameraDragState.hasDragged = false
      canvas.setPointerCapture(e.pointerId)
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging.current) return
      const dx = e.clientX - dragStartX.current
      if (Math.abs(dx) > DRAG_THRESHOLD) {
        hasDragged.current = true
        cameraDragState.hasDragged = true
      }
      springTarget.current = dragStartRot.current + dx * DRAG_SENSITIVITY
      // Direct spring follow during drag (no lag)
      springPos.current = springTarget.current
      springVel.current = 0
    }

    function onPointerUp() {
      if (!isDragging.current) return
      isDragging.current = false
      if (hasDragged.current) {
        // Snap to nearest integer
        const nearest = Math.round(springTarget.current / angleStep)
        springTarget.current = nearest * angleStep
        const newActive = wrap(-nearest, N)
        activeIndexRef.current = newActive
        setActiveIndex(newActive)
        if (validArtists[newActive]) onActiveChange(newActive, validArtists[newActive])
      }
      // Reset drag flag after a tick so click handlers can check it
      setTimeout(() => { cameraDragState.hasDragged = false }, 100)
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (e.deltaY > 0) goNextRef.current()
      else goPrevRef.current()
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNextRef.current()
      else if (e.key === 'ArrowLeft') goPrevRef.current()
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup',   onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup',   onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [gl, N, angleStep, validArtists, onActiveChange])

  // ── Spring + position update ──────────────────────────────
  useFrame((_, dt) => {
    if (N === 0) return
    const safe = Math.min(dt, 0.033)

    if (!isDragging.current) {
      // Spring physics
      const dx    = springTarget.current - springPos.current
      const force = dx * SPRING_TENSION - springVel.current * SPRING_FRICTION
      springVel.current += force * safe
      springPos.current += springVel.current * safe
    }

    // Update each card group position imperatively
    for (let i = 0; i < N; i++) {
      const group = cardGroupRefs.current[i]
      if (!group) continue
      const angle = i * angleStep + springPos.current
      group.position.set(
        RADIUS * Math.sin(angle),
        0,
        RADIUS * Math.cos(angle),
      )
      group.rotation.y = -angle
    }

    // Recompute active index from spring position
    const nearest  = Math.round(-springPos.current / angleStep)
    const computed = wrap(nearest, N)
    if (computed !== lastCommitted.current) {
      lastCommitted.current = computed
      activeIndexRef.current = computed
      setActiveIndex(computed)
      if (validArtists[computed]) onActiveChange(computed, validArtists[computed])
    }
  })

  if (N === 0) return null

  return (
    <>
      {validArtists.map((artist, i) => {
        // Compute initial angle for first render (before useFrame runs)
        const angle0 = i * angleStep
        const dist = Math.min(wrap(i - activeIndex, N), wrap(activeIndex - i, N))
        const cardState: GalleryCardState =
          dist === 0 ? 'active' :
          dist === 1 ? 'neighbor' :
          'background'

        return (
          <group
            key={artist.id}
            ref={(el) => { cardGroupRefs.current[i] = el }}
            position={[RADIUS * Math.sin(angle0), 0, RADIUS * Math.cos(angle0)]}
            rotation={[0, -angle0, 0]}
          >
            <GalleryCard
              artist={artist}
              cardState={cardState}
              isFlipped={activeFlipped && dist === 0}
              floatSeed={i / Math.max(N, 1)}
              onClick={() => {
                if (cameraDragState.hasDragged) return
                if (dist !== 0) goToIndex(i)
              }}
              onDoubleClick={() => {
                if (cameraDragState.hasDragged) return
                if (dist === 0) {
                  setSelectedArtist(artist)
                  navigate('/artist/' + artist.id)
                }
              }}
            />
          </group>
        )
      })}
    </>
  )
}
