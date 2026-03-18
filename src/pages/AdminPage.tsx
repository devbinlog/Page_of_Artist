import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  collection, query, where, onSnapshot,
  doc, updateDoc, deleteDoc, orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface PendingArtist {
  firestoreId: string
  name: string
  description: string
  genres: string[]
  imageUrl: string
  spotifyUrl: string
  instagramUrl: string
  albumName: string
  albumImageUrl: string
  featuredTrackName: string
  createdAt: unknown
}

// 간단한 PIN 인증 (환경변수 VITE_ADMIN_PIN, 없으면 '0000')
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '0000'

export function AdminPage() {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [pinError, setPinError] = useState(false)

  const [pending, setPending] = useState<PendingArtist[]>([])
  const [loading, setLoading] = useState(false)
  const [firebaseOk, setFirebaseOk] = useState(true)
  const [actionMsg, setActionMsg] = useState('')

  // Firestore 구독 (인증 후)
  useEffect(() => {
    if (!authed) return
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      setFirebaseOk(false)
      return
    }

    setLoading(true)
    try {
      const q = query(
        collection(db, 'artists'),
        where('approved', '==', false),
        orderBy('createdAt', 'asc'),
      )

      const unsub = onSnapshot(
        q,
        (snap) => {
          setLoading(false)
          setPending(snap.docs.map((d) => {
            const data = d.data()
            return {
              firestoreId: d.id,
              name: data.name ?? '',
              description: data.description ?? '',
              genres: data.genres ?? [],
              imageUrl: data.imageUrl ?? '',
              spotifyUrl: data.spotifyUrl ?? '',
              instagramUrl: data.instagramUrl ?? '',
              albumName: data.featuredAlbum?.name ?? '',
              albumImageUrl: data.featuredAlbum?.imageUrl ?? '',
              featuredTrackName: data.featuredTrack?.name ?? '',
              createdAt: data.createdAt,
            }
          }))
        },
        (err) => {
          setLoading(false)
          console.warn('[AdminPage] Firestore error:', err.message)
          setFirebaseOk(false)
        }
      )
      return unsub
    } catch {
      setLoading(false)
      setFirebaseOk(false)
    }
  }, [authed])

  async function handleApprove(firestoreId: string, name: string) {
    try {
      await updateDoc(doc(db, 'artists', firestoreId), { approved: true })
      showAction(`✓ "${name}" 승인 완료`)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleReject(firestoreId: string, name: string) {
    if (!confirm(`"${name}"을(를) 삭제하시겠습니까?`)) return
    try {
      await deleteDoc(doc(db, 'artists', firestoreId))
      showAction(`✗ "${name}" 삭제 완료`)
    } catch (e) {
      console.error(e)
    }
  }

  function showAction(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(''), 3000)
  }

  // ── PIN 화면 ──────────────────────────────────────
  if (!authed) {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, maxWidth: 320, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: '#E8EAFF', fontSize: 18, margin: '0 0 8px', fontFamily: 'sans-serif' }}>
            Admin 접근
          </h2>
          <p style={{ color: '#8892B0', fontSize: 13, marginBottom: 20, fontFamily: 'sans-serif' }}>PIN을 입력해주세요</p>
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinError(false) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (pin === ADMIN_PIN) { setAuthed(true) }
                else setPinError(true)
              }
            }}
            placeholder="PIN"
            style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.3em', marginBottom: 12 }}
            autoFocus
          />
          {pinError && <p style={{ color: '#FF6B6B', fontSize: 12, margin: '0 0 12px', fontFamily: 'sans-serif' }}>잘못된 PIN입니다</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate(-1)} style={{ ...btnSecondary, flex: 1 }}>뒤로</button>
            <button
              onClick={() => {
                if (pin === ADMIN_PIN) setAuthed(true)
                else setPinError(true)
              }}
              style={{ ...btnPrimary, flex: 1 }}
            >
              입력
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── 어드민 패널 ───────────────────────────────────
  return (
    <div style={pageStyle}>
      {/* 헤더 */}
      <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 10 }}>
        <button onClick={() => navigate('/gallery')} style={navBtnStyle}>← 갤러리</button>
      </div>

      <div style={{ width: '100%', maxWidth: 760, paddingTop: 16 }}>
        <h1 style={{ color: '#E8EAFF', fontSize: 22, margin: '0 0 4px', fontFamily: 'sans-serif', fontWeight: 700 }}>
          어드민 패널
        </h1>
        <p style={{ color: '#8892B0', fontSize: 13, margin: '0 0 24px', fontFamily: 'sans-serif' }}>
          승인 대기 중인 아티스트를 검토합니다.
        </p>

        {actionMsg && (
          <div style={{
            padding: '10px 16px', marginBottom: 16, borderRadius: 10,
            background: 'rgba(108,142,255,0.15)', border: '1px solid rgba(108,142,255,0.3)',
            color: '#6C8EFF', fontSize: 13, fontFamily: 'sans-serif',
          }}>
            {actionMsg}
          </div>
        )}

        {!firebaseOk && (
          <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', color: '#FF6B6B', fontSize: 13, fontFamily: 'sans-serif', marginBottom: 16 }}>
            Firebase 설정이 없거나 연결에 실패했습니다. .env에 VITE_FIREBASE_PROJECT_ID 등을 설정해주세요.
          </div>
        )}

        {loading && (
          <p style={{ color: '#8892B0', fontFamily: 'sans-serif', fontSize: 14 }}>불러오는 중...</p>
        )}

        {!loading && firebaseOk && pending.length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '40px 28px' }}>
            <p style={{ color: '#8892B0', fontFamily: 'sans-serif', fontSize: 14, margin: 0 }}>
              대기 중인 아티스트가 없습니다.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pending.map((artist) => (
            <ArtistReviewCard
              key={artist.firestoreId}
              artist={artist}
              onApprove={() => handleApprove(artist.firestoreId, artist.name)}
              onReject={() => handleReject(artist.firestoreId, artist.name)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 개별 아티스트 검토 카드 ────────────────────────
function ArtistReviewCard({
  artist,
  onApprove,
  onReject,
}: {
  artist: PendingArtist
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* 아티스트 이미지 */}
        <div style={{
          width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
          background: 'rgba(108,142,255,0.12)', border: '1px solid rgba(108,142,255,0.2)',
        }}>
          {artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={artist.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B80A8', fontSize: 24 }}>
              🎵
            </div>
          )}
        </div>

        {/* 정보 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ color: '#E8EAFF', fontWeight: 700, fontSize: 15, fontFamily: 'sans-serif' }}>
              {artist.name}
            </span>
            {artist.genres.slice(0, 3).map((g) => (
              <span key={g} style={{
                padding: '2px 8px', borderRadius: 20,
                background: 'rgba(108,142,255,0.15)', border: '1px solid rgba(108,142,255,0.25)',
                fontSize: 11, color: '#6C8EFF', fontFamily: 'sans-serif',
              }}>
                {g}
              </span>
            ))}
          </div>

          {artist.description && (
            <p style={{ color: '#8892B0', fontSize: 12, margin: '0 0 6px', fontFamily: 'sans-serif', lineHeight: 1.5 }}>
              {artist.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11, color: '#6B80A8', fontFamily: 'sans-serif' }}>
            {artist.featuredTrackName && <span>🎵 {artist.featuredTrackName}</span>}
            {artist.albumName && <span>💿 {artist.albumName}</span>}
            {artist.spotifyUrl && (
              <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6C8EFF', textDecoration: 'none' }}>
                Spotify ↗
              </a>
            )}
            {artist.instagramUrl && (
              <a href={artist.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6C8EFF', textDecoration: 'none' }}>
                Instagram ↗
              </a>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <button onClick={onApprove} style={btnApprove}>✓ 승인</button>
          <button onClick={onReject} style={btnReject}>✗ 거절</button>
        </div>
      </div>
    </div>
  )
}

// ─── 스타일 ─────────────────────────────────────────
const pageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  overflowY: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '60px 16px 40px',
  boxSizing: 'border-box',
  position: 'relative',
}

const cardStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(108,142,255,0.18)',
  borderRadius: 16,
  padding: '20px 22px',
  backdropFilter: 'blur(16px)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 13px',
  fontSize: 14,
  border: '1px solid rgba(108,142,255,0.25)',
  borderRadius: 10,
  background: 'rgba(13,20,55,0.7)',
  color: '#E8EAFF',
  outline: 'none',
  fontFamily: 'sans-serif',
  boxSizing: 'border-box',
}

const btnPrimary: React.CSSProperties = {
  padding: '9px 20px',
  background: 'linear-gradient(135deg, #6C8EFF 0%, #3B6AFF 100%)',
  border: 'none',
  borderRadius: 10,
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'sans-serif',
}

const btnSecondary: React.CSSProperties = {
  padding: '9px 20px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(108,142,255,0.25)',
  borderRadius: 10,
  color: '#8892B0',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'sans-serif',
}

const navBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(108,142,255,0.25)',
  borderRadius: 20,
  fontSize: 13,
  color: '#8892B0',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)',
  fontFamily: 'sans-serif',
}

const btnApprove: React.CSSProperties = {
  padding: '7px 16px',
  background: 'rgba(74,222,128,0.15)',
  border: '1px solid rgba(74,222,128,0.35)',
  borderRadius: 8,
  color: '#4ade80',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'sans-serif',
  whiteSpace: 'nowrap',
}

const btnReject: React.CSSProperties = {
  padding: '7px 16px',
  background: 'rgba(255,107,107,0.12)',
  border: '1px solid rgba(255,107,107,0.3)',
  borderRadius: 8,
  color: '#FF6B6B',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'sans-serif',
  whiteSpace: 'nowrap',
}
