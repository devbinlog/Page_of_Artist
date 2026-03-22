import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { SceneBackground } from '@/components/scene/SceneBackground'
import { ExhibitionCamera } from '@/components/scene/ExhibitionCamera'
import { MusicElements } from '@/components/scene/MusicElements'
import { ArtistCard } from '@/components/card/ArtistCard'
import { NavBar } from '@/components/navigation/NavBar'
import { useStore } from '@/store/useStore'
import { extractAlbumColorLight } from '@/utils/colorExtract'
import { colors } from '@/styles/tokens'

// ─── Social link button (HTML panel) ─────────────────────
function SocialBtn({
  href, icon, label, color,
}: {
  href?: string
  icon: string
  label: string
  color: string
}) {
  const [hov, setHov] = useState(false)
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px',
        background: hov ? color : '#F5F7FA',
        border: `1.5px solid ${hov ? color : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 12,
        textDecoration: 'none',
        color: hov ? '#fff' : colors.textPrimary,
        fontSize: 14, fontWeight: 500, fontFamily: 'sans-serif',
        transition: 'all 0.18s',
        flex: 1,
        boxShadow: hov ? `0 4px 16px ${color}40` : 'none',
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </a>
  )
}

// ─── Genre chip ───────────────────────────────────────────
function GenreChip({ label }: { label: string }) {
  return (
    <span style={{
      padding: '5px 14px',
      background: 'rgba(79,125,243,0.08)',
      border: '1.5px solid rgba(79,125,243,0.2)',
      borderRadius: 20,
      fontSize: 12, fontWeight: 600, color: colors.brand,
      fontFamily: 'sans-serif', letterSpacing: '0.04em',
      textTransform: 'uppercase' as const,
    }}>
      #{label}
    </span>
  )
}

// ─── Artist Page ──────────────────────────────────────────
export function ArtistPage() {
  const { selectedArtist, artists, setSelectedArtist } = useStore()
  const navigate = useNavigate()
  const { id }   = useParams<{ id: string }>()
  const [bgColors, setBgColors] = useState<[string, string]>(['#F0F6FF', '#EDE9FF'])

  useEffect(() => {
    if (!selectedArtist && id && artists.length > 0) {
      const found = artists.find((a) => a.id === id)
      if (found) setSelectedArtist(found)
      else        navigate('/gallery')
    }
    if (!selectedArtist && !id) navigate('/gallery')
  }, [selectedArtist, id, artists, setSelectedArtist, navigate])

  useEffect(() => {
    if (!selectedArtist) return
    extractAlbumColorLight(selectedArtist.featuredAlbum.imageUrl).then(setBgColors)
  }, [selectedArtist])

  if (!selectedArtist) return null

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', position: 'relative',
      overflow: 'hidden',
    }}>
      <NavBar />

      {/* ── Left info panel ── */}
      <div style={{
        width: '38%', flexShrink: 0,
        height: '100%',
        paddingTop: 80,
        overflowY: 'auto',
        background: colors.bgWhite,
        boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
        position: 'relative',
        zIndex: 2,
        boxSizing: 'border-box' as const,
      }}>
        <div style={{ padding: '36px 40px 60px 56px' }}>

          {/* Nav row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 36 }}>
            <button
              onClick={() => navigate('/gallery')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                background: colors.bgLight,
                border: `1px solid ${colors.borderSoft}`,
                borderRadius: 10,
                fontSize: 13, color: colors.textSecondary,
                cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 500,
              }}
            >
              ← Gallery
            </button>
            <button
              onClick={() => navigate('/intro')}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: `1px solid ${colors.borderSoft}`,
                borderRadius: 10,
                fontSize: 13, color: colors.textSecondary,
                cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 500,
              }}
            >
              Home
            </button>
          </div>

          {/* Label */}
          <div style={{
            fontSize: 10, letterSpacing: '0.12em', color: colors.brand,
            fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 12,
            textTransform: 'uppercase' as const,
          }}>
            Artist Profile
          </div>

          {/* Artist name */}
          <h1 style={{
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: 800, color: colors.textPrimary,
            margin: '0 0 16px', fontFamily: 'sans-serif',
            letterSpacing: '-1.5px', lineHeight: 1.1,
          }}>
            {selectedArtist.name}
          </h1>

          {/* Genre chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 28 }}>
            {selectedArtist.genres.map((g, i) => (
              <GenreChip key={i} label={g} />
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: 1, background: colors.borderSoft, marginBottom: 28,
          }} />

          {/* Description */}
          {selectedArtist.description && (
            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontSize: 11, letterSpacing: '0.08em', color: colors.textMuted,
                fontWeight: 600, fontFamily: 'sans-serif', marginBottom: 10,
                textTransform: 'uppercase' as const,
              }}>
                About
              </div>
              <p style={{
                fontSize: 15, color: colors.textSecondary,
                fontFamily: 'sans-serif', lineHeight: 1.75, margin: 0,
              }}>
                {selectedArtist.description}
              </p>
            </div>
          )}

          {/* Featured track */}
          {selectedArtist.featuredTrack?.name && (
            <div style={{
              padding: '14px 16px',
              background: colors.bgLight,
              borderRadius: 14,
              border: `1px solid ${colors.borderLight}`,
              marginBottom: 28,
            }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.1em', color: colors.textMuted,
                fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 8,
                textTransform: 'uppercase' as const,
              }}>
                Featured Track
              </div>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{
                    fontSize: 15, fontWeight: 700, color: colors.textPrimary,
                    fontFamily: 'sans-serif',
                  }}>
                    {selectedArtist.featuredTrack.name}
                  </div>
                  <div style={{
                    fontSize: 12, color: colors.textMuted,
                    fontFamily: 'sans-serif', marginTop: 2,
                  }}>
                    {selectedArtist.name}
                  </div>
                </div>
                {selectedArtist.featuredTrack.youtubeUrl && (
                  <a
                    href={selectedArtist.featuredTrack.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: '#FF0000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none',
                      boxShadow: '0 2px 10px rgba(255,0,0,0.25)',
                      flexShrink: 0,
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="white" style={{ display: 'block' }}><path d="M8 5v14l11-7z"/></svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Album info */}
          {selectedArtist.featuredAlbum && (
            <div style={{ marginBottom: 28 }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.1em', color: colors.textMuted,
                fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 12,
                textTransform: 'uppercase' as const,
              }}>
                Featured Album
              </div>
              <div style={{
                display: 'flex', gap: 14, alignItems: 'center',
                padding: '14px 16px',
                background: colors.bgLight,
                borderRadius: 14,
                border: `1px solid ${colors.borderLight}`,
              }}>
                <img
                    src={selectedArtist.featuredAlbum.imageUrl || selectedArtist.imageUrl}
                    alt={selectedArtist.featuredAlbum.name}
                    style={{
                      width: 54, height: 54, borderRadius: 8,
                      objectFit: 'cover', flexShrink: 0,
                      background: colors.bgLight,
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      if (img.src !== selectedArtist.imageUrl && selectedArtist.imageUrl) {
                        img.src = selectedArtist.imageUrl
                      } else {
                        img.style.display = 'none'
                      }
                    }}
                  />
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: colors.textPrimary,
                    fontFamily: 'sans-serif',
                  }}>
                    {selectedArtist.featuredAlbum.name}
                  </div>
                  <div style={{
                    fontSize: 12, color: colors.textMuted,
                    fontFamily: 'sans-serif', marginTop: 2,
                  }}>
                    {selectedArtist.featuredAlbum.tracks?.length ?? 0} tracks
                  </div>
                </div>
                {selectedArtist.albumYoutubeUrl && (
                  <a
                    href={selectedArtist.albumYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 'auto',
                      width: 36, height: 36, borderRadius: 8,
                      background: '#FF0000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none',
                      boxShadow: '0 2px 10px rgba(255,0,0,0.25)',
                      flexShrink: 0,
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="white" style={{ display: 'block' }}><path d="M8 5v14l11-7z"/></svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Social links */}
          <div style={{
            fontSize: 10, letterSpacing: '0.1em', color: colors.textMuted,
            fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 12,
            textTransform: 'uppercase' as const,
          }}>
            Connect
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <SocialBtn
              href={selectedArtist.spotifyUrl}
              icon="🎵" label="Spotify"
              color="#1DB954"
            />
            <SocialBtn
              href={selectedArtist.instagramUrl}
              icon="📷" label="Instagram"
              color="#E1306C"
            />
            {selectedArtist.featuredTrack?.youtubeUrl && (
              <SocialBtn
                href={selectedArtist.featuredTrack.youtubeUrl}
                icon="▶️" label="YouTube"
                color="#FF0000"
              />
            )}
          </div>

          {/* Hint */}
          <div style={{
            marginTop: 20, padding: '14px 16px',
            background: 'rgba(79,125,243,0.05)',
            borderRadius: 12,
            border: '1px solid rgba(79,125,243,0.12)',
          }}>
            <div style={{
              fontSize: 12, color: colors.textMuted,
              fontFamily: 'sans-serif', lineHeight: 1.6,
            }}>
              🎴 <strong>Click the card</strong> to flip &amp; see tracklist<br />
              🎵 <strong>Click the vinyl</strong> to play on Spotify<br />
              🖱️ <strong>Drag the scene</strong> to orbit
            </div>
          </div>
        </div>
      </div>

      {/* ── Right 3D scene ── */}
      <div style={{
        flex: 1,
        height: '100%',
        background: `linear-gradient(160deg, ${bgColors[0]} 0%, ${bgColors[1]} 60%, #f5f0ff 100%)`,
        position: 'relative',
        cursor: 'grab',
      }}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneBackground cameraControl={false} />
          <ExhibitionCamera
            initialRadius={7}
            initialTheta={0}
            initialPhi={0.05}
            minRadius={4.5}
            maxRadius={12}
            hoverStrength={0.12}
            orbitSensitivity={0.006}
            zoomThreshold={5.5}
          />
          <MusicElements />

          {/* Artist card — centered */}
          <ArtistCard
            artist={selectedArtist}
            mode="detail"
            position={[0, 0, 0]}
            scale={1}
            onDoubleClick={() => navigate('/gallery')}
          />
        </Canvas>

        {/* Attribution */}
        <div style={{
          position: 'absolute', bottom: 16, right: 16,
          fontSize: 11, color: '#6B80A8', fontFamily: 'sans-serif',
          pointerEvents: 'none',
        }}>
          Artist data manually curated
        </div>
      </div>
    </div>
  )
}
