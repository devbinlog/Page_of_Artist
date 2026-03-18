import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { NavBar } from '@/components/navigation/NavBar'
import { colors, radius, shadow, inputStyle } from '@/styles/tokens'

type Tab = 'login' | 'signup'

function translateError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':    return '이미 사용 중인 이메일입니다.'
    case 'auth/invalid-email':           return '올바르지 않은 이메일 형식입니다.'
    case 'auth/user-not-found':          return '등록되지 않은 이메일입니다.'
    case 'auth/wrong-password':          return '비밀번호가 올바르지 않습니다.'
    case 'auth/invalid-credential':      return '이메일 또는 비밀번호가 올바르지 않습니다.'
    case 'auth/weak-password':           return '비밀번호는 6자 이상이어야 합니다.'
    case 'auth/too-many-requests':       return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
    case 'auth/network-request-failed':  return '네트워크 오류가 발생했습니다.'
    case 'auth/configuration-not-found': return 'Firebase Authentication이 활성화되지 않았습니다. Firebase 콘솔에서 이메일/비밀번호 인증을 활성화해주세요.'
    default:                             return '오류가 발생했습니다. 다시 시도해주세요.'
  }
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      padding: '12px 14px',
      background: 'rgba(255,107,107,0.08)',
      border: '1px solid rgba(255,107,107,0.25)',
      borderRadius: radius.md,
      color: colors.brandCoral,
      fontSize: 13,
      fontFamily: 'sans-serif',
      lineHeight: 1.5,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
      {msg}
    </div>
  )
}

export function AuthPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('login')

  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [nickname,  setNickname]  = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  // Focus states for input styling
  const [focusedField, setFocusedField] = useState<string | null>(null)

  function focusStyle(name: string): React.CSSProperties {
    return {
      ...inputStyle,
      borderColor: focusedField === name ? colors.brand : 'rgba(0,0,0,0.12)',
      boxShadow: focusedField === name ? '0 0 0 3px rgba(79,125,243,0.12)' : 'none',
    }
  }

  function switchTab(t: Tab) {
    setTab(t); setError('')
    setEmail(''); setPassword(''); setNickname(''); setConfirmPw('')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return }
    setLoading(true); setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/intro', { replace: true })
    } catch (err: unknown) {
      setError(translateError((err as { code?: string }).code ?? ''))
    } finally { setLoading(false) }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim())     { setError('닉네임을 입력해주세요.'); return }
    if (!email)               { setError('이메일을 입력해주세요.'); return }
    if (password.length < 6)  { setError('비밀번호는 6자 이상이어야 합니다.'); return }
    if (password !== confirmPw) { setError('비밀번호가 일치하지 않습니다.'); return }
    setLoading(true); setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid, nickname: nickname.trim(),
        email: email.toLowerCase(), createdAt: serverTimestamp(),
      })
      navigate('/intro', { replace: true })
    } catch (err: unknown) {
      setError(translateError((err as { code?: string }).code ?? ''))
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: colors.bgLight,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px 40px',
      boxSizing: 'border-box' as const,
      overflowY: 'auto',
      position: 'relative',
    }}>
      <NavBar />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440,
        background: '#FFFFFF',
        borderRadius: 24,
        padding: '40px 40px 44px',
        boxShadow: shadow.modal,
        border: `1px solid ${colors.borderSoft}`,
      }}>

        {/* Logo + header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: colors.gradientBrand,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 6px 20px rgba(79,125,243,0.3)',
          }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 800, fontFamily: 'sans-serif' }}>P</span>
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: colors.textPrimary,
            fontFamily: 'sans-serif', letterSpacing: '-0.3px',
          }}>
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </div>
          <div style={{
            fontSize: 13, color: colors.textMuted,
            fontFamily: 'sans-serif', marginTop: 4,
          }}>
            {tab === 'login'
              ? 'Log in to Page of Artist'
              : 'Join the music discovery platform'}
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: colors.bgLight,
          borderRadius: radius.md,
          padding: 4, marginBottom: 28, gap: 4,
        }}>
          {(['login', 'signup'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              style={{
                flex: 1, padding: '9px 0', border: 'none', borderRadius: 9,
                background: tab === t ? '#FFFFFF' : 'transparent',
                color: tab === t ? colors.textPrimary : colors.textMuted,
                fontSize: 14, fontWeight: tab === t ? 600 : 500,
                cursor: 'pointer', fontFamily: 'sans-serif',
                boxShadow: tab === t ? shadow.sm : 'none',
                transition: 'all 0.2s',
              }}
            >
              {t === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* ── Login form ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                style={focusStyle('email')}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('pw')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                style={focusStyle('pw')}
                autoComplete="current-password"
              />
            </div>
            {error && <ErrorBox msg={error} />}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px 0',
                background: loading ? colors.textMuted : colors.brand,
                border: 'none', borderRadius: radius.md,
                color: '#fff', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'sans-serif', marginTop: 4,
                boxShadow: loading ? 'none' : shadow.brand,
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>
            <p style={{ textAlign: 'center', color: colors.textMuted, fontSize: 13, margin: 0, fontFamily: 'sans-serif' }}>
              Don't have an account?{' '}
              <span onClick={() => switchTab('signup')} style={{ color: colors.brand, cursor: 'pointer', fontWeight: 600 }}>
                Sign Up
              </span>
            </p>
          </form>
        )}

        {/* ── Sign up form ── */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Nickname *</label>
              <input
                type="text" value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onFocus={() => setFocusedField('nick')}
                onBlur={() => setFocusedField(null)}
                placeholder="Your display name"
                style={focusStyle('nick')}
                autoComplete="nickname"
              />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                style={focusStyle('email')}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={labelStyle}>Password * (min. 6 characters)</label>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('pw')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                style={focusStyle('pw')}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input
                type="password" value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                onFocus={() => setFocusedField('cpw')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                style={{
                  ...focusStyle('cpw'),
                  borderColor: confirmPw && confirmPw !== password
                    ? colors.brandCoral
                    : focusedField === 'cpw' ? colors.brand : 'rgba(0,0,0,0.12)',
                }}
                autoComplete="new-password"
              />
              {confirmPw && confirmPw !== password && (
                <div style={{
                  fontSize: 12, color: colors.brandCoral,
                  fontFamily: 'sans-serif', marginTop: 4,
                }}>
                  Passwords do not match
                </div>
              )}
            </div>
            {error && <ErrorBox msg={error} />}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px 0',
                background: loading ? colors.textMuted : colors.gradientBrand,
                border: 'none', borderRadius: radius.md,
                color: '#fff', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'sans-serif', marginTop: 4,
                boxShadow: loading ? 'none' : shadow.brand,
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p style={{ textAlign: 'center', color: colors.textMuted, fontSize: 13, margin: 0, fontFamily: 'sans-serif' }}>
              Already have an account?{' '}
              <span onClick={() => switchTab('login')} style={{ color: colors.brand, cursor: 'pointer', fontWeight: 600 }}>
                Log In
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: colors.textSecondary,
  fontSize: 13, fontWeight: 500,
  marginBottom: 6,
  fontFamily: 'sans-serif',
}
