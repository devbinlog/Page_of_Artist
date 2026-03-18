import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { NavBar } from '@/components/navigation/NavBar'
import { colors, radius, shadow, inputStyle } from '@/styles/tokens'

// ── Form data ─────────────────────────────────────────────
interface FormData {
  name: string
  description: string
  genres: string
  imageUrl: string
  spotifyUrl: string
  instagramUrl: string
  featuredTrackName: string
  featuredTrackYoutubeUrl: string
  albumName: string
  albumImageUrl: string
  albumYoutubeUrl: string
  tracks: string
}

const EMPTY: FormData = {
  name: '', description: '', genres: '', imageUrl: '',
  spotifyUrl: '', instagramUrl: '',
  featuredTrackName: '', featuredTrackYoutubeUrl: '',
  albumName: '', albumImageUrl: '', albumYoutubeUrl: '', tracks: '',
}

// ── Step definitions ──────────────────────────────────────
const STEPS = [
  {
    id: 1,
    label: 'Basic Info',
    desc: 'Name, genres & image',
    icon: '🎤',
  },
  {
    id: 2,
    label: 'Social Links',
    desc: 'Spotify & Instagram',
    icon: '🔗',
  },
  {
    id: 3,
    label: 'Featured Track',
    desc: 'Best track & YouTube',
    icon: '🎵',
  },
  {
    id: 4,
    label: 'Album Info',
    desc: 'Album & tracklist',
    icon: '💿',
  },
]

// ── Field component ───────────────────────────────────────
function Field({
  label, value, onChange, placeholder, required = false, focusedKey, focusKey,
  onFocus, onBlur,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  focusedKey: string | null
  focusKey: string
  onFocus: (k: string) => void
  onBlur: () => void
}) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 13, fontWeight: 500,
        color: colors.textSecondary, marginBottom: 6, fontFamily: 'sans-serif',
      }}>
        {label}{required && <span style={{ color: colors.brand, marginLeft: 3 }}>*</span>}
      </label>
      <input
        type="text" value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => onFocus(focusKey)}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          borderColor: focusedKey === focusKey ? colors.brand : 'rgba(0,0,0,0.12)',
          boxShadow: focusedKey === focusKey ? '0 0 0 3px rgba(79,125,243,0.1)' : 'none',
        }}
      />
    </div>
  )
}

// ── Card preview ──────────────────────────────────────────
function CardPreview({ form }: { form: FormData }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0px 16px 40px rgba(79,125,243,0.15)',
      border: `1px solid ${colors.borderLight}`,
      width: 220,
    }}>
      {/* Image area */}
      <div style={{
        height: 160, background: colors.gradientBrand,
        position: 'relative', overflow: 'hidden',
      }}>
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt={form.name || 'Artist'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        {!form.imageUrl && (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 6,
          }}>
            <span style={{ fontSize: 28, opacity: 0.5 }}>🎤</span>
            <span style={{
              fontSize: 10, color: 'rgba(255,255,255,0.7)',
              fontFamily: 'sans-serif', fontWeight: 600,
              letterSpacing: '0.08em',
            }}>
              ADD IMAGE URL
            </span>
          </div>
        )}
        {form.genres && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            padding: '3px 8px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 12, fontSize: 9, fontWeight: 700,
            color: colors.brandPurple, fontFamily: 'sans-serif',
            letterSpacing: '0.05em', textTransform: 'uppercase' as const,
          }}>
            {form.genres.split(',')[0]?.trim() || 'Genre'}
          </div>
        )}
      </div>

      {/* Info area */}
      <div style={{ padding: '14px 16px 18px' }}>
        <div style={{
          fontSize: 15, fontWeight: 700, color: colors.textPrimary,
          fontFamily: 'sans-serif', marginBottom: 4, letterSpacing: '-0.3px',
        }}>
          {form.name || 'Artist Name'}
        </div>
        {form.featuredTrackName && (
          <div style={{
            fontSize: 12, color: colors.textMuted,
            fontFamily: 'sans-serif', marginBottom: 8,
          }}>
            🎵 {form.featuredTrackName}
          </div>
        )}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
          {(form.genres ? form.genres.split(',') : []).slice(0, 2).map((g, i) => (
            <span key={i} style={{
              padding: '2px 7px', background: colors.bgLight,
              borderRadius: 5, fontSize: 10, color: colors.textSecondary,
              fontFamily: 'sans-serif',
            }}>
              {g.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────
export function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [focusedKey, setFocusedKey] = useState<string | null>(null)

  function change(field: keyof FormData, v: string) {
    setForm((prev) => ({ ...prev, [field]: v }))
  }

  function validate(): string | null {
    if (step === 1) {
      if (!form.name.trim())   return 'Artist name is required.'
      if (!form.genres.trim()) return 'At least one genre is required.'
    }
    if (step === 3 && !form.featuredTrackName.trim()) return 'Featured track name is required.'
    if (step === 4 && !form.albumName.trim())         return 'Album name is required.'
    return null
  }

  function next() {
    const err = validate()
    if (err) { setErrorMsg(err); return }
    setErrorMsg(''); setStep((s) => s + 1)
  }

  function back() { setErrorMsg(''); setStep((s) => s - 1) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setErrorMsg(err); return }
    setStatus('submitting'); setErrorMsg('')
    try {
      const tracks = form.tracks
        .split('\n').map((t, i) => ({ number: i + 1, name: t.trim() })).filter((t) => t.name)
      const genres = form.genres
        .split(',').map((g) => g.trim().toLowerCase()).filter(Boolean)

      await addDoc(collection(db, 'artists'), {
        name: form.name.trim(), description: form.description.trim(),
        genres, imageUrl: form.imageUrl.trim(),
        spotifyUrl: form.spotifyUrl.trim(), instagramUrl: form.instagramUrl.trim(),
        featuredTrack: {
          name: form.featuredTrackName.trim(),
          youtubeUrl: form.featuredTrackYoutubeUrl.trim(),
        },
        featuredAlbum: {
          id: form.name.toLowerCase().replace(/\s+/g, '-') + '-album',
          name: form.albumName.trim(),
          imageUrl: form.albumImageUrl.trim(),
          tracks,
        },
        albumYoutubeUrl: form.albumYoutubeUrl.trim(),
        createdAt: serverTimestamp(),
        approved: true,
      })
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Error saving. Please check your Firebase configuration.')
    }
  }

  // ── Success screen ────────────────────────────────────
  if (status === 'success') {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: colors.bgLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px',
        boxSizing: 'border-box' as const,
      }}>
        <NavBar />
        <div style={{
          textAlign: 'center', maxWidth: 460,
          background: '#FFFFFF', borderRadius: 24,
          padding: '52px 48px',
          boxShadow: shadow.modal,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(29,185,84,0.1)',
            border: '2px solid rgba(29,185,84,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 20px',
          }}>✓</div>
          <h2 style={{
            fontSize: 24, fontWeight: 800, color: colors.textPrimary,
            margin: '0 0 10px', fontFamily: 'sans-serif', letterSpacing: '-0.5px',
          }}>
            Registration Submitted!
          </h2>
          <p style={{
            fontSize: 15, color: colors.textSecondary,
            fontFamily: 'sans-serif', lineHeight: 1.65, margin: '0 0 32px',
          }}>
            Your artist profile has been received and is pending admin review.
            You'll be visible in the gallery once approved.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/gallery')}
              style={{
                padding: '12px 28px', background: colors.brand,
                border: 'none', borderRadius: radius.md,
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'sans-serif',
                boxShadow: shadow.brand,
              }}
            >
              View Gallery
            </button>
            <button
              onClick={() => { setForm(EMPTY); setStep(1); setStatus('idle') }}
              style={{
                padding: '12px 28px', background: 'transparent',
                border: `1.5px solid ${colors.borderMedium}`,
                borderRadius: radius.md,
                color: colors.brand, fontSize: 14, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'sans-serif',
              }}
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main layout ───────────────────────────────────────
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', position: 'relative',
      overflow: 'hidden', background: colors.bgLight,
    }}>
      <NavBar />

      {/* ── Left: step nav + preview ── */}
      <div style={{
        width: 300, flexShrink: 0, height: '100%',
        paddingTop: 80,
        background: '#FFFFFF',
        boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
        overflowY: 'auto',
        boxSizing: 'border-box' as const,
        zIndex: 1,
      }}>
        <div style={{ padding: '36px 28px' }}>
          {/* Title */}
          <div style={{
            fontSize: 11, letterSpacing: '0.1em', color: colors.brand,
            fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 8,
            textTransform: 'uppercase' as const,
          }}>
            Registration
          </div>
          <h2 style={{
            fontSize: 22, fontWeight: 800, color: colors.textPrimary,
            margin: '0 0 32px', fontFamily: 'sans-serif', letterSpacing: '-0.5px',
          }}>
            Register Artist
          </h2>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {STEPS.map((s) => {
              const done   = step > s.id
              const active = step === s.id
              return (
                <div
                  key={s.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: active
                      ? 'rgba(79,125,243,0.08)'
                      : done ? 'rgba(29,185,84,0.06)' : 'transparent',
                    border: `1.5px solid ${
                      active ? 'rgba(79,125,243,0.25)'
                      : done ? 'rgba(29,185,84,0.2)'
                      : 'transparent'
                    }`,
                    cursor: done ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => done && setStep(s.id)}
                >
                  {/* Step circle */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: active ? colors.brand : done ? '#1DB954' : colors.bgLight,
                    border: `2px solid ${
                      active ? colors.brand : done ? '#1DB954' : 'rgba(0,0,0,0.1)'
                    }`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    color: active || done ? '#fff' : colors.textMuted,
                    transition: 'all 0.2s',
                  }}>
                    {done ? '✓' : s.id}
                  </div>

                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      color: active ? colors.textPrimary : done ? '#1DB954' : colors.textSecondary,
                      fontFamily: 'sans-serif',
                    }}>
                      {s.label}
                    </div>
                    <div style={{
                      fontSize: 11, color: colors.textMuted,
                      fontFamily: 'sans-serif', marginTop: 1,
                    }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Card preview */}
          <div style={{ marginTop: 36 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.1em', color: colors.textMuted,
              fontWeight: 700, fontFamily: 'sans-serif', marginBottom: 14,
              textTransform: 'uppercase' as const,
            }}>
              Card Preview
            </div>
            <CardPreview form={form} />
          </div>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div style={{
        flex: 1, height: '100%',
        paddingTop: 80,
        overflowY: 'auto',
        boxSizing: 'border-box' as const,
      }}>
        <div style={{
          maxWidth: 640, margin: '0 auto',
          padding: '48px 48px 80px',
        }}>
          {/* Step header */}
          {STEPS.map((s) => s.id === step && (
            <div key={s.id} style={{ marginBottom: 36 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 14px',
                background: 'rgba(79,125,243,0.08)',
                borderRadius: 20, marginBottom: 12,
              }}>
                <span>{s.icon}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: colors.brand,
                  fontFamily: 'sans-serif', letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                }}>
                  Step {s.id} of {STEPS.length}
                </span>
              </div>
              <h2 style={{
                fontSize: 30, fontWeight: 800, color: colors.textPrimary,
                margin: 0, fontFamily: 'sans-serif', letterSpacing: '-1px',
              }}>
                {s.label}
              </h2>
            </div>
          ))}

          {/* Progress bar */}
          <div style={{
            height: 4, background: colors.bgLight,
            borderRadius: 2, marginBottom: 40, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(step / STEPS.length) * 100}%`,
              background: colors.gradientBrand,
              borderRadius: 2,
              transition: 'width 0.4s ease',
            }} />
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* ── Step 1: Basic Info ── */}
            {step === 1 && (
              <>
                <Field label="Artist Name" value={form.name} onChange={(v) => change('name', v)}
                  placeholder="e.g. LANY" required
                  focusedKey={focusedKey} focusKey="name"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
                <Field label="Genres (comma-separated)" value={form.genres} onChange={(v) => change('genres', v)}
                  placeholder="indie pop, synth-pop, dream pop" required
                  focusedKey={focusedKey} focusKey="genres"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
                <Field label="Artist Image URL" value={form.imageUrl} onChange={(v) => change('imageUrl', v)}
                  placeholder="https://..."
                  focusedKey={focusedKey} focusKey="imageUrl"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
                <div>
                  <label style={labelStyle}>Artist Bio</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => change('description', e.target.value)}
                    placeholder="Describe the artist in a few sentences…"
                    rows={4}
                    style={{
                      ...inputStyle, resize: 'vertical' as const,
                      borderColor: focusedKey === 'desc' ? colors.brand : 'rgba(0,0,0,0.12)',
                      boxShadow: focusedKey === 'desc' ? '0 0 0 3px rgba(79,125,243,0.1)' : 'none',
                    }}
                    onFocus={() => setFocusedKey('desc')}
                    onBlur={() => setFocusedKey(null)}
                  />
                </div>
              </>
            )}

            {/* ── Step 2: Social Links ── */}
            {step === 2 && (
              <>
                <Field label="Spotify Artist URL" value={form.spotifyUrl} onChange={(v) => change('spotifyUrl', v)}
                  placeholder="https://open.spotify.com/artist/…"
                  focusedKey={focusedKey} focusKey="spotify"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
                <Field label="Instagram URL" value={form.instagramUrl} onChange={(v) => change('instagramUrl', v)}
                  placeholder="https://www.instagram.com/…"
                  focusedKey={focusedKey} focusKey="instagram"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
              </>
            )}

            {/* ── Step 3: Featured Track ── */}
            {step === 3 && (
              <>
                <Field label="Track Name" value={form.featuredTrackName} onChange={(v) => change('featuredTrackName', v)}
                  placeholder="e.g. ILYSB" required
                  focusedKey={focusedKey} focusKey="trackname"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
                <Field label="YouTube Music Video URL" value={form.featuredTrackYoutubeUrl} onChange={(v) => change('featuredTrackYoutubeUrl', v)}
                  placeholder="https://www.youtube.com/watch?v=…"
                  focusedKey={focusedKey} focusKey="trackyt"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
              </>
            )}

            {/* ── Step 4: Album Info ── */}
            {step === 4 && (
              <>
                <Field label="Album Name" value={form.albumName} onChange={(v) => change('albumName', v)}
                  placeholder="e.g. mama's boy" required
                  focusedKey={focusedKey} focusKey="album"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
                <Field label="Album Cover Image URL" value={form.albumImageUrl} onChange={(v) => change('albumImageUrl', v)}
                  placeholder="https://…"
                  focusedKey={focusedKey} focusKey="albumimg"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
                <Field label="Album YouTube URL" value={form.albumYoutubeUrl} onChange={(v) => change('albumYoutubeUrl', v)}
                  placeholder="https://www.youtube.com/watch?v=…"
                  focusedKey={focusedKey} focusKey="albumyt"
                  onFocus={setFocusedKey} onBlur={() => setFocusedKey(null)} />
                <div>
                  <label style={labelStyle}>Tracklist (one track per line)</label>
                  <textarea
                    value={form.tracks}
                    onChange={(e) => change('tracks', e.target.value)}
                    placeholder={'Thick and Thin\nI Still Talk to Jesus\nHeart Won\'t Let Me'}
                    rows={6}
                    style={{
                      ...inputStyle, resize: 'vertical' as const,
                      borderColor: focusedKey === 'tracks' ? colors.brand : 'rgba(0,0,0,0.12)',
                      boxShadow: focusedKey === 'tracks' ? '0 0 0 3px rgba(79,125,243,0.1)' : 'none',
                    }}
                    onFocus={() => setFocusedKey('tracks')}
                    onBlur={() => setFocusedKey(null)}
                  />
                </div>
              </>
            )}

            {/* Error message */}
            {errorMsg && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '12px 14px',
                background: 'rgba(255,107,107,0.08)',
                border: '1px solid rgba(255,107,107,0.25)',
                borderRadius: radius.md,
                color: colors.brandCoral, fontSize: 13, fontFamily: 'sans-serif',
              }}>
                ⚠ {errorMsg}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              {step > 1 && (
                <button
                  type="button" onClick={back}
                  style={{
                    flex: 1, padding: '13px 0',
                    background: 'transparent',
                    border: `1.5px solid ${colors.borderMedium}`,
                    borderRadius: radius.md,
                    color: colors.textSecondary, fontSize: 14, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'sans-serif',
                  }}
                >
                  ← Back
                </button>
              )}

              {step < STEPS.length ? (
                <button
                  type="button" onClick={next}
                  style={{
                    flex: 1, padding: '13px 0',
                    background: colors.brand,
                    border: 'none', borderRadius: radius.md,
                    color: '#fff', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'sans-serif',
                    boxShadow: shadow.brand,
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  style={{
                    flex: 1, padding: '13px 0',
                    background: status === 'submitting'
                      ? colors.textMuted
                      : colors.gradientBrand,
                    border: 'none', borderRadius: radius.md,
                    color: '#fff', fontSize: 14, fontWeight: 600,
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                    fontFamily: 'sans-serif',
                    boxShadow: status === 'submitting' ? 'none' : shadow.brand,
                    transition: 'all 0.2s',
                  }}
                >
                  {status === 'submitting' ? 'Submitting…' : '✓ Submit Registration'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 500,
  color: colors.textSecondary, marginBottom: 6, fontFamily: 'sans-serif',
}
