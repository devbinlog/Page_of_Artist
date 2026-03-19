import { useState, useMemo, useRef, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useThree } from '@react-three/fiber'
import { SceneBackground } from '@/components/scene/SceneBackground'
import { AmbientParticles } from '@/components/scene/AmbientParticles'
import { StaffLines } from '@/components/scene/StaffLines'
import { FloorRing } from '@/components/scene/FloorRing'
import { CircularCarousel } from '@/components/carousel/CircularCarousel'
import { NavBar } from '@/components/navigation/NavBar'
import { useStore } from '@/store/useStore'
import { useFirestoreArtists } from '@/hooks/useFirestoreArtists'
import type { Artist } from '@/types/artist'
import { colors } from '@/styles/tokens'
import * as THREE from 'three'

const GENRE_FILTERS = [
  { label: 'All',        value: '' },
  { label: 'Pop',        value: 'pop' },
  { label: 'Hip-Hop',    value: 'hip-hop' },
  { label: 'Rock',       value: 'rock' },
  { label: 'R&B',        value: 'r&b' },
  { label: 'Indie',      value: 'indie' },
  { label: 'Electronic', value: 'synth' },
  { label: 'Latin',      value: 'latin' },
]

// ─── Camera setup ─────────────────────────────────────────
// 낮은 eye-level 시점, 카드 정면 구도
function GalleryCamera() {
  const { camera } = useThree()
  useLayoutEffect(() => {
    camera.position.set(0, 1.6, 9.0)
    camera.lookAt(new THREE.Vector3(0, 0.0, 0))
    if ((camera as THREE.PerspectiveCamera).fov !== undefined) {
      ;(camera as THREE.PerspectiveCamera).fov = 46
      ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
    }
  }, [camera])
  return null
}

// ─── CSS 3D grid card ─────────────────────────────────────
function GridCard({ artist, onClick }: { artist: Artist; onClick: () => void }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hov, setHov] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  function onMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setTilt({
      x:  ((e.clientY - (r.top  + r.height / 2)) / r.height) * 10,
      y: -((e.clientX - (r.left + r.width  / 2)) / r.width)  * 10,
    })
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHov(false) }}
      onClick={onClick}
      style={{
        borderRadius: 20, overflow: 'hidden', background: '#FFFFFF',
        boxShadow: hov ? '0 20px 40px rgba(79,125,243,0.18)' : '0 8px 24px rgba(0,0,0,0.06)',
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hov ? -6 : 0}px)`,
        transition: !hov ? 'transform 0.5s ease, box-shadow 0.3s ease' : 'box-shadow 0.3s ease',
        cursor: 'pointer', willChange: 'transform',
      }}
    >
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: colors.gradientBrand }}>
        {artist.imageUrl
          ? <img src={artist.imageUrl} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.4s ease' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: 'rgba(255,255,255,0.35)' }}>🎵</div>
        }
        <div style={{ position: 'absolute', top: 10, left: 10, padding: '3px 9px', background: 'rgba(255,255,255,0.9)', borderRadius: 16, fontSize: 10, fontWeight: 700, color: colors.brandPurple, fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', backdropFilter: 'blur(8px)' }}>
          #{artist.genres[0] || 'Music'}
        </div>
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, fontFamily: 'sans-serif', marginBottom: 4 }}>{artist.name}</div>
        {artist.description && <div style={{ fontSize: 12, color: colors.textSecondary, fontFamily: 'sans-serif', lineHeight: 1.5, marginBottom: 10 }}>{artist.description.length > 60 ? artist.description.slice(0, 60) + '…' : artist.description}</div>}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {artist.genres.slice(0, 2).map((g, i) => (
            <span key={i} style={{ padding: '2px 7px', background: colors.bgLight, borderRadius: 5, fontSize: 10, color: colors.textSecondary, fontFamily: 'sans-serif' }}>#{g}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Info panel (HTML overlay below carousel) ─────────────
function InfoPanel({
  artist, isFlipped, onFlip, onOpen,
}: {
  artist: Artist | null
  isFlipped: boolean
  onFlip: () => void
  onOpen: () => void
}) {
  if (!artist) return null
  return (
    <div style={{
      position: 'absolute',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 440,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(24px)',
      borderRadius: 20,
      border: '1px solid rgba(79,125,243,0.15)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
      padding: '16px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      pointerEvents: 'auto',
      zIndex: 50,
    }}>
      {/* Artist thumbnail */}
      <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: colors.gradientBrand }}>
        {artist.imageUrl && <img src={artist.imageUrl} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: colors.textPrimary, fontFamily: 'sans-serif', letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {artist.name}
        </div>
        <div style={{ fontSize: 12, color: colors.textMuted, fontFamily: 'sans-serif', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {artist.featuredTrack?.name && `♪ ${artist.featuredTrack.name}  ·  `}
          {artist.genres.slice(0, 2).map(g => `#${g}`).join('  ')}
        </div>
        {artist.description && (
          <div style={{ fontSize: 11, color: colors.textSecondary, fontFamily: 'sans-serif', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {artist.description.length > 60 ? artist.description.slice(0, 60) + '…' : artist.description}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={onFlip}
          style={{
            padding: '8px 14px',
            background: isFlipped ? colors.brand : 'transparent',
            border: `1.5px solid ${isFlipped ? colors.brand : 'rgba(79,125,243,0.35)'}`,
            borderRadius: 10,
            fontSize: 12, fontWeight: 600,
            color: isFlipped ? '#fff' : colors.brand,
            cursor: 'pointer', fontFamily: 'sans-serif',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {isFlipped ? '↩ Front' : '🎴 Flip'}
        </button>
        <button
          onClick={onOpen}
          style={{
            padding: '8px 16px',
            background: colors.brand,
            border: 'none',
            borderRadius: 10,
            fontSize: 12, fontWeight: 700,
            color: '#fff',
            cursor: 'pointer', fontFamily: 'sans-serif',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 12px rgba(79,125,243,0.35)',
          }}
        >
          Open →
        </button>
      </div>
    </div>
  )
}

// ─── Gallery Page ─────────────────────────────────────────
export function GalleryPage() {
  const artists        = useStore(s => s.artists)
  const genreFilter    = useStore(s => s.genreFilter)
  const setGenreFilter = useStore(s => s.setGenreFilter)
  const setSelectedArtist = useStore(s => s.setSelectedArtist)
  const navigate       = useNavigate()
  const [view, setView] = useState<'3d' | 'grid'>('3d')

  // Info panel state
  const [activeArtist, setActiveArtist] = useState<Artist | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  useFirestoreArtists()

  const filteredArtists = useMemo(() => {
    const valid = artists.filter(a => a.name.trim() && a.genres.length > 0)
    if (!genreFilter) return valid
    return valid.filter(a => a.genres.some(g => g.toLowerCase().includes(genreFilter)))
  }, [artists, genreFilter])

  function handleActiveChange(_idx: number, artist: Artist) {
    setActiveArtist(artist)
    setIsFlipped(false)
  }

  function handleFlip() {
    setIsFlipped(f => !f)
  }

  function handleOpen() {
    if (!activeArtist) return
    setSelectedArtist(activeArtist)
    navigate('/artist/' + activeArtist.id)
  }

  // ── 3D VIEW ──────────────────────────────────────────────
  if (view === '3d') {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, #eef3ff 0%, #e8f0ff 40%, #f0ebff 100%)' }}>
        <NavBar />

        {/* Control bar */}
        <div style={{
          position: 'absolute', top: 80, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: 52,
          background: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(79,125,243,0.10)',
        }}>
          {/* Genre chips */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', overflowX: 'auto', flex: 1, paddingRight: 24 }}>
            {GENRE_FILTERS.map(gf => {
              const active = genreFilter === gf.value
              return (
                <button key={gf.value} onClick={() => setGenreFilter(gf.value)} style={{
                  padding: '5px 13px', borderRadius: 20, flexShrink: 0,
                  border: `1.5px solid ${active ? colors.brand : 'rgba(79,125,243,0.2)'}`,
                  fontSize: 12, cursor: 'pointer',
                  background: active ? colors.brand : 'rgba(255,255,255,0.9)',
                  color: active ? '#fff' : colors.brand,
                  fontWeight: active ? 700 : 500, fontFamily: 'sans-serif',
                  transition: 'all 0.15s',
                  boxShadow: active ? '0 2px 8px rgba(79,125,243,0.28)' : 'none',
                }}>
                  {gf.label}
                </button>
              )
            })}
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', background: colors.bgLight, borderRadius: 10, padding: 3, gap: 2, flexShrink: 0 }}>
            <button onClick={() => setView('3d')} style={{
              padding: '5px 14px', minWidth: 72,
              background: colors.brand, border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer',
              fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
              <span>✦</span> 3D
            </button>
            <button onClick={() => setView('grid')} style={{
              padding: '5px 14px', minWidth: 72,
              background: 'transparent', border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 500, color: colors.textSecondary, cursor: 'pointer',
              fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
              ☰ Grid
            </button>
          </div>
        </div>

        {/* 3D Canvas — fills below control bar */}
        <div style={{ position: 'absolute', top: 132, left: 0, right: 0, bottom: 0, pointerEvents: 'auto' }}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 1.6, 9.0], fov: 46 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <GalleryCamera />
            {/* Lights — required for meshStandardMaterial on card bodies */}
            <ambientLight intensity={0.55} color="#c8d8ff" />
            <directionalLight position={[4, 8, 6]} intensity={0.7} color="#ffffff" />
            <directionalLight position={[-4, 2, 4]} intensity={0.25} color="#a0c0ff" />
            <SceneBackground cameraControl={false} />
            <AmbientParticles />
            <StaffLines />
            <FloorRing />
            <CircularCarousel
              key={genreFilter}
              artists={filteredArtists}
              activeFlipped={isFlipped}
              onActiveChange={handleActiveChange}
            />
          </Canvas>

          {/* Info panel overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, pointerEvents: 'none' }}>
            <InfoPanel
              artist={activeArtist}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              onOpen={handleOpen}
            />
          </div>
        </div>

        {/* Keyboard hint */}
        <div style={{
          position: 'absolute', bottom: 136, left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 11, color: '#8A9BBF', fontFamily: 'sans-serif',
          pointerEvents: 'none', whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span>← → 키보드</span>
          <span style={{ color: 'rgba(79,125,243,0.25)' }}>|</span>
          <span>스크롤 카드 이동</span>
          <span style={{ color: 'rgba(79,125,243,0.25)' }}>|</span>
          <span>드래그 회전</span>
          <span style={{ color: 'rgba(79,125,243,0.25)' }}>|</span>
          <span>더블클릭 상세</span>
        </div>
      </div>
    )
  }

  // ── GRID VIEW ─────────────────────────────────────────────
  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', background: colors.bgWhite }}>
      <NavBar />
      <div style={{ paddingTop: 80, background: `linear-gradient(180deg, ${colors.bgWhite} 0%, ${colors.bgLight} 100%)` }}>
        <div style={{ padding: '48px 120px 0', maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', color: colors.brand, fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 12, textTransform: 'uppercase' }}>
            Discover
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: 42, fontWeight: 800, color: colors.textPrimary, margin: 0, fontFamily: 'sans-serif', letterSpacing: '-1.5px' }}>
              Artist Gallery
              <span style={{ marginLeft: 16, fontSize: 18, fontWeight: 500, color: colors.textMuted, letterSpacing: 0 }}>
                {filteredArtists.length} artists
              </span>
            </h1>
            {/* View toggle */}
            <div style={{ display: 'flex', background: colors.bgLight, borderRadius: 12, padding: 3, gap: 2, border: `1px solid ${colors.borderLight}` }}>
              <button onClick={() => setView('3d')} style={{
                padding: '9px 20px', minWidth: 100,
                background: 'transparent', border: 'none', borderRadius: 10,
                fontSize: 13, fontWeight: 500, color: colors.textSecondary, cursor: 'pointer',
                fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <span>✦</span> 3D View
              </button>
              <button onClick={() => setView('grid')} style={{
                padding: '9px 20px', minWidth: 100,
                background: colors.gradientBrand, border: 'none', borderRadius: 10,
                fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
                fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 2px 10px rgba(79,125,243,0.3)',
              }}>
                ☰ Grid
              </button>
            </div>
          </div>
        </div>

        {/* Sticky filter bar */}
        <div style={{ position: 'sticky', top: 80, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${colors.borderSoft}`, zIndex: 100, padding: '0 120px', marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 4, maxWidth: 1400, margin: '0 auto', overflowX: 'auto', padding: '12px 0' }}>
            {GENRE_FILTERS.map(gf => {
              const active = genreFilter === gf.value
              const count = gf.value ? artists.filter(a => a.genres.some(g => g.toLowerCase().includes(gf.value))).length : artists.length
              return (
                <button key={gf.value} onClick={() => setGenreFilter(gf.value)} style={{
                  padding: '7px 18px', borderRadius: 20, flexShrink: 0,
                  border: `1.5px solid ${active ? colors.brand : colors.borderLight}`,
                  fontSize: 13, cursor: 'pointer',
                  background: active ? colors.brand : 'transparent',
                  color: active ? '#fff' : colors.textSecondary,
                  fontWeight: active ? 600 : 500, fontFamily: 'sans-serif',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {gf.label}
                  <span style={{ fontSize: 11, color: active ? 'rgba(255,255,255,0.75)' : colors.textMuted, background: active ? 'rgba(255,255,255,0.2)' : colors.bgLight, padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '36px 120px 80px', maxWidth: 1400, margin: '0 auto' }}>
        {filteredArtists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: colors.textMuted, fontFamily: 'sans-serif', fontSize: 16 }}>
            No artists found.
            <br />
            <button onClick={() => setGenreFilter('')} style={{ marginTop: 16, padding: '8px 20px', background: 'transparent', border: `1.5px solid ${colors.borderMedium}`, borderRadius: 10, color: colors.brand, cursor: 'pointer', fontFamily: 'sans-serif', fontSize: 14 }}>
              Clear Filter
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
            {filteredArtists.map(artist => (
              <GridCard
                key={artist.id}
                artist={artist}
                onClick={() => { setSelectedArtist(artist); navigate('/artist/' + artist.id) }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '24px 120px', borderTop: `1px solid ${colors.borderSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: colors.textMuted, fontFamily: 'sans-serif' }}>Artist data manually curated</span>
        <button onClick={() => navigate('/intro')} style={{ background: 'none', border: 'none', fontSize: 13, color: colors.textMuted, cursor: 'pointer', fontFamily: 'sans-serif' }}>
          ← Back to Home
        </button>
      </div>
    </div>
  )
}
