import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { NavBar } from '@/components/navigation/NavBar'
import { useStore } from '@/store/useStore'
import { searchArtists } from '@/hooks/useSpotify'
import type { Artist } from '@/types/artist'
import { colors } from '@/styles/tokens'
import { CardFront } from '@/components/card/CardFront'
import { CardBack } from '@/components/card/CardBack'

// ─── Genre chips data ────────────────────────────────────
const GENRE_CHIPS = ['All', 'Rock', 'Indie', 'Pop', 'Electronic', 'Hip-hop', 'R&B', 'Latin']

// ─── Demo Card 3D scene (hero right panel) ───────────────
// 항상 템플릿 카드를 표시 — 실제 아티스트 데이터 불필요
const TEMPLATE_TRACKS = [
  { number: 1, name: 'Opening Track' },
  { number: 2, name: 'Featured Single' },
  { number: 3, name: 'Fan Favourite' },
  { number: 4, name: 'Deep Cut' },
  { number: 5, name: 'Closing Track' },
]

function DemoCardScene() {
  const outerRef     = useRef<THREE.Group>(null)
  const flipRef      = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const targetRotY   = useRef(0)
  const currentRotY  = useRef(0)
  const [showFront, setShowFront] = useState(true)
  const showFrontRef = useRef(true)
  const scaleV       = useRef(1)
  const tiltRef      = useRef({ x: 0, y: 0 })

  useFrame(() => {
    if (!flipRef.current || !outerRef.current) return
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetRotY.current, 0.07)
    flipRef.current.rotation.y = currentRotY.current
    const front = Math.cos(currentRotY.current) > 0
    if (front !== showFrontRef.current) {
      showFrontRef.current = front
      setShowFront(front)
    }
    scaleV.current = THREE.MathUtils.lerp(scaleV.current, hovered ? 1.08 : 1.0, 0.08)
    outerRef.current.scale.setScalar(scaleV.current)
  })

  return (
    <>
      <ambientLight intensity={2.4} />
      <directionalLight position={[4, 6, 5]}   intensity={1.8} color="#ffffff" />
      <directionalLight position={[-3, 2, -3]} intensity={0.6} color="#7C5CFF" />
      <pointLight       position={[0, 2, 4]}   intensity={1.0} color="#4F7DF3" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={2.2}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.7}
      />
      <group ref={outerRef} rotation={[0.08, 0.25, 0.22]}>
        <group
          ref={flipRef}
          onPointerEnter={() => { setHovered(true);  document.body.style.cursor = 'pointer' }}
          onPointerLeave={() => { setHovered(false); document.body.style.cursor = '' }}
          onClick={(e) => { e.stopPropagation(); targetRotY.current -= Math.PI }}
        >
          {showFront && (
            <CardFront
              artistName="Artist Name"
              genres={['MUSIC', 'DISCOVERY']}
              imageUrl=""
              featuredTrackName="Featured Track"
              featuredTrackYoutubeUrl=""
              albumImageUrl=""
              tiltRef={tiltRef}
            />
          )}
          {!showFront && (
            <group rotation={[0, Math.PI, 0]}>
              <CardBack
                albumName="Featured Album"
                albumYoutubeUrl=""
                albumImageUrl=""
                tracks={TEMPLATE_TRACKS}
              />
            </group>
          )}
        </group>
      </group>
    </>
  )
}

// ─── CSS 3D artist card (HTML, gallery grid) ─────────────
function ArtistCard2D({
  artist,
  onClick,
}: {
  artist: Artist
  onClick: () => void
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x:  ((e.clientY - cy) / rect.height) * 12,
      y: -((e.clientX - cx) / rect.width)  * 12,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
      onClick={onClick}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        background: '#FFFFFF',
        boxShadow: hovered
          ? '0px 20px 40px rgba(79,125,243,0.18)'
          : '0px 8px 24px rgba(0,0,0,0.07)',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? -8 : 0}px)`,
        transition: !hovered
          ? 'transform 0.5s ease, box-shadow 0.3s ease'
          : 'box-shadow 0.3s ease',
        cursor: 'pointer',
        willChange: 'transform',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: colors.gradientBrand }}>
        {artist.imageUrl ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 44, color: 'rgba(255,255,255,0.4)',
          }}>🎵</div>
        )}
        {/* Genre badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          padding: '4px 10px',
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 20,
          fontSize: 11, fontWeight: 700, color: colors.brandPurple,
          fontFamily: 'sans-serif', letterSpacing: '0.04em',
          backdropFilter: 'blur(8px)',
          textTransform: 'uppercase' as const,
        }}>
          {artist.genres[0] || 'Music'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 22px' }}>
        <div style={{
          fontSize: 18, fontWeight: 700, color: colors.textPrimary,
          fontFamily: 'sans-serif', marginBottom: 6, letterSpacing: '-0.3px',
        }}>
          {artist.name}
        </div>
        {artist.description && (
          <div style={{
            fontSize: 13, color: colors.textSecondary, fontFamily: 'sans-serif',
            lineHeight: 1.55, marginBottom: 14,
          }}>
            {artist.description.length > 75
              ? artist.description.slice(0, 75) + '…'
              : artist.description}
          </div>
        )}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {artist.genres.slice(0, 2).map((g, i) => (
              <span key={i} style={{
                padding: '3px 8px',
                background: colors.bgLight,
                borderRadius: 6,
                fontSize: 11, color: colors.textSecondary,
                fontFamily: 'sans-serif',
              }}>#{g}</span>
            ))}
          </div>
          <span style={{
            color: hovered ? colors.brand : colors.textMuted,
            fontSize: 18, fontWeight: 600,
            transition: 'color 0.2s, transform 0.2s',
            transform: hovered ? 'translateX(3px)' : 'none',
            display: 'inline-block',
          }}>→</span>
        </div>
      </div>
    </div>
  )
}

// ─── Genre Chip ───────────────────────────────────────────
function GenreChip({ label, onSelect }: { label: string; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 20px',
        background: hovered ? colors.brand : '#FFFFFF',
        border: `1.5px solid ${hovered ? colors.brand : colors.borderMedium}`,
        borderRadius: 20,
        fontSize: 13, fontWeight: 500,
        color: hovered ? '#ffffff' : colors.brand,
        cursor: 'pointer', fontFamily: 'sans-serif',
        transition: 'all 0.15s',
        boxShadow: hovered ? '0 4px 12px rgba(79,125,243,0.25)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

// ─── Main IntroPage ──────────────────────────────────────
export function IntroPage() {
  const { artists, setSelectedArtist, searchQuery, setSearchQuery, setGenreFilter } = useStore()
  const navigate = useNavigate()
  const [searchFocused, setSearchFocused] = useState(false)

  const searchResults = useMemo(
    () => (searchQuery.trim() ? searchArtists(artists, searchQuery).slice(0, 6) : []),
    [artists, searchQuery]
  )

  const featuredArtists = useMemo(() => artists.slice(0, 8), [artists])

  function handleSelectArtist(artist: Artist) {
    setSelectedArtist(artist)
    setSearchQuery('')
    navigate('/artist/' + artist.id)
  }

  function handleGenreChip(genre: string) {
    if (genre === 'All') {
      setGenreFilter('')
    } else {
      setGenreFilter(genre.toLowerCase())
    }
    navigate('/gallery')
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      overflowY: 'auto', overflowX: 'hidden',
      background: colors.bgWhite,
      position: 'relative',
    }}>
      <NavBar />

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section style={{
        display: 'flex',
        minHeight: '100vh',
        paddingTop: 80,
        overflow: 'hidden',
      }}>
        {/* Left — copy + CTA */}
        <div style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 64px 60px 120px',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px',
            background: 'rgba(79,125,243,0.08)',
            border: '1px solid rgba(79,125,243,0.15)',
            borderRadius: 20,
            marginBottom: 28,
            alignSelf: 'flex-start',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: colors.brand, display: 'inline-block',
              boxShadow: '0 0 6px rgba(79,125,243,0.6)',
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: colors.brand,
              fontFamily: 'sans-serif', letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
            }}>
              Music Discovery Platform
            </span>
          </div>

          {/* Hero title */}
          <h1 style={{
            fontSize: 'clamp(48px, 5vw, 68px)',
            fontWeight: 800,
            color: colors.textPrimary,
            lineHeight: 1.06,
            margin: '0 0 24px',
            fontFamily: 'sans-serif',
            letterSpacing: '-2.5px',
          }}>
            Discover<br />
            Artists<br />
            <span style={{
              backgroundImage: colors.gradientBrand,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              In Motion
            </span>
          </h1>

          <p style={{
            fontSize: 18, color: colors.textSecondary, lineHeight: 1.72,
            maxWidth: 420, margin: '0 0 40px',
            fontFamily: 'sans-serif',
          }}>
            Explore innovative musicians through interactive 3D experiences.
            Flip cards, rotate perspectives, and discover your next favourite artist.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/gallery')}
              style={{
                padding: '14px 36px',
                background: colors.brand,
                border: 'none', borderRadius: 12,
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'sans-serif',
                boxShadow: '0 4px 20px rgba(79,125,243,0.35)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              Explore Gallery
              <span style={{ fontSize: 18 }}>→</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '14px 36px',
                background: 'transparent',
                border: '1.5px solid rgba(79,125,243,0.35)',
                borderRadius: 12,
                color: colors.brand, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'sans-serif',
              }}
            >
              Register Artist
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 48, marginTop: 56 }}>
            {[
              { num: `${artists.length || 30}+`, label: 'Artists' },
              { num: '3D',                       label: 'Interactive' },
              { num: '∞',                        label: 'Discovery' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{
                  fontSize: 30, fontWeight: 800, color: colors.textPrimary,
                  fontFamily: 'sans-serif', letterSpacing: '-1px',
                }}>
                  {num}
                </div>
                <div style={{
                  fontSize: 13, color: colors.textMuted,
                  fontFamily: 'sans-serif', marginTop: 3,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D canvas */}
        <div style={{
          flex: '0 0 50%',
          position: 'relative',
          background: 'linear-gradient(135deg, #F0F4FF 0%, #EAF0FF 40%, #F3EEFF 100%)',
          overflow: 'hidden',
        }}>
          {/* Decorative blobs */}
          <div style={{
            position: 'absolute', top: '15%', right: '12%',
            width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,125,243,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '18%', left: '8%',
            width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '55%', right: '30%',
            width: 140, height: 140, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.3, 7.0], fov: 44 }}
            gl={{ antialias: true, alpha: true }}
          >
            <DemoCardScene />
          </Canvas>

          {/* Hint label */}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 12, color: colors.textMuted, fontFamily: 'sans-serif',
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.8)',
            padding: '6px 14px', borderRadius: 20,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(79,125,243,0.1)',
            whiteSpace: 'nowrap' as const,
          }}>
            <span>🎴</span> Click to flip · Drag to orbit
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SEARCH MODULE
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '88px 24px', background: colors.bgLight }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          {/* Section label */}
          <div style={{
            fontSize: 11, letterSpacing: '0.1em', color: colors.brand,
            fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 14,
            textTransform: 'uppercase' as const,
          }}>
            Find Your Sound
          </div>
          <h2 style={{
            fontSize: 36, fontWeight: 800, color: colors.textPrimary,
            margin: '0 0 36px', fontFamily: 'sans-serif', letterSpacing: '-1px',
          }}>
            Search Artists
          </h2>

          {/* Search input */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 20, top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 18, color: colors.textMuted, pointerEvents: 'none',
            }}>
              🔍
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 160)}
              placeholder="Search artists or genres"
              style={{
                width: '100%',
                padding: '18px 20px 18px 54px',
                fontSize: 16,
                border: `2px solid ${searchFocused ? colors.brand : 'rgba(79,125,243,0.18)'}`,
                borderRadius: 16,
                background: '#FFFFFF',
                color: colors.textPrimary,
                outline: 'none',
                fontFamily: 'sans-serif',
                boxSizing: 'border-box' as const,
                boxShadow: searchFocused
                  ? '0 4px 24px rgba(79,125,243,0.15)'
                  : '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.2s',
              }}
            />

            {/* Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)', left: 0, right: 0,
                background: '#FFFFFF',
                border: '1px solid rgba(79,125,243,0.15)',
                borderRadius: 16,
                boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                zIndex: 200,
                overflow: 'hidden',
                textAlign: 'left',
              }}>
                {searchResults.map((artist) => (
                  <div
                    key={artist.id}
                    onMouseDown={() => handleSelectArtist(artist)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', cursor: 'pointer',
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = colors.bgLight)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 9,
                      overflow: 'hidden', flexShrink: 0,
                      background: colors.gradientBrand,
                    }}>
                      {artist.imageUrl && (
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 600, color: colors.textPrimary,
                        fontFamily: 'sans-serif',
                      }}>
                        {artist.name}
                      </div>
                      <div style={{
                        fontSize: 12, color: colors.textMuted, fontFamily: 'sans-serif',
                      }}>
                        {artist.genres[0]}
                      </div>
                    </div>
                    <span style={{ color: colors.brand, fontSize: 14 }}>→</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Genre chips */}
          <div style={{
            display: 'flex', gap: 8, marginTop: 24,
            flexWrap: 'wrap' as const, justifyContent: 'center',
          }}>
            {GENRE_CHIPS.map((genre) => (
              <GenreChip key={genre} label={genre} onSelect={() => handleGenreChip(genre)} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED ARTISTS GRID
      ══════════════════════════════════════════════════ */}
      {featuredArtists.length > 0 && (
        <section style={{ padding: '88px 120px' }}>
          {/* Section header */}
          <div style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', marginBottom: 48,
          }}>
            <div>
              <div style={{
                fontSize: 11, letterSpacing: '0.1em', color: colors.brand,
                fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 10,
                textTransform: 'uppercase' as const,
              }}>
                Browse
              </div>
              <h2 style={{
                fontSize: 32, fontWeight: 800, color: colors.textPrimary,
                margin: 0, fontFamily: 'sans-serif', letterSpacing: '-1px',
              }}>
                Featured Artists
              </h2>
            </div>
            <button
              onClick={() => navigate('/gallery')}
              style={{
                padding: '10px 24px',
                background: 'transparent',
                border: `1.5px solid ${colors.borderMedium}`,
                borderRadius: 10,
                fontSize: 14, color: colors.brand, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'sans-serif',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              View All Gallery →
            </button>
          </div>

          {/* 4-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 28,
          }}>
            {featuredArtists.map((artist) => (
              <ArtistCard2D
                key={artist.id}
                artist={artist}
                onClick={() => {
                  setSelectedArtist(artist)
                  navigate('/artist/' + artist.id)
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer style={{
        padding: '32px 120px',
        borderTop: `1px solid ${colors.borderSoft}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: colors.bgWhite,
      }}>
        <div style={{ fontSize: 13, color: colors.textMuted, fontFamily: 'sans-serif' }}>
          © 2024 Page of Artist · Artist data manually curated
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Gallery',   path: '/gallery' },
            { label: 'Register',  path: '/register' },
            { label: 'Login',     path: '/auth' },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                background: 'none', border: 'none',
                fontSize: 13, color: colors.textMuted,
                cursor: 'pointer', fontFamily: 'sans-serif',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  )
}
