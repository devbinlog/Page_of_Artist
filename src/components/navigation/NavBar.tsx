import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { colors } from '@/styles/tokens'

interface NavBarProps {
  /** 'light' = white bg (default), 'overlay' = transparent over 3D canvas */
  mode?: 'light' | 'overlay'
}

export function NavBar({ mode = 'light' }: NavBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const isOverlay = mode === 'overlay'

  const navLinks = [
    { label: 'Gallery', path: '/gallery' },
  ]

  function isActive(path: string) {
    return location.pathname === path
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 80,
      background: isOverlay ? 'rgba(255,255,255,0.0)' : '#FFFFFF',
      borderBottom: isOverlay ? 'none' : `1px solid ${colors.borderSoft}`,
      backdropFilter: 'blur(20px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 48px',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      transition: 'background 0.3s',
    }}>

      {/* ── Logo ── */}
      <div
        onClick={() => navigate('/intro')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: colors.gradientBrand,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(79,125,243,0.3)',
        }}>
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 800, fontFamily: 'sans-serif', lineHeight: 1 }}>P</span>
        </div>
        <div>
          <div style={{
            fontSize: 15, fontWeight: 700, color: colors.textPrimary,
            fontFamily: 'sans-serif', letterSpacing: '-0.3px', lineHeight: 1.2,
          }}>
            Page of Artist
          </div>
          <div style={{
            fontSize: 9, color: colors.textMuted, fontFamily: 'sans-serif',
            letterSpacing: '0.12em', textTransform: 'uppercase' as const, lineHeight: 1,
          }}>
            Music Discovery
          </div>
        </div>
      </div>

      {/* ── Nav Links ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {navLinks.map(({ label, path }) => {
          const active = isActive(path)
          const hovered = hoveredLink === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              onMouseEnter={() => setHoveredLink(path)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                padding: '7px 14px',
                background: active || hovered ? 'rgba(79,125,243,0.07)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                color: active ? colors.brand : hovered ? colors.brand : colors.textSecondary,
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                fontWeight: active ? 600 : 500,
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          )
        })}

        {/* Search icon */}
        <button
          onClick={() => navigate('/gallery')}
          onMouseEnter={() => setHoveredLink('search')}
          onMouseLeave={() => setHoveredLink(null)}
          title="Search"
          style={{
            width: 38, height: 38,
            background: hoveredLink === 'search' ? 'rgba(79,125,243,0.07)' : 'transparent',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            marginLeft: 4,
            transition: 'background 0.15s',
          }}
        >
          🔍
        </button>

        {/* Divider */}
        <div style={{
          width: 1, height: 22,
          background: colors.borderSoft,
          margin: '0 12px',
        }} />

        {/* Login button */}
        <button
          onClick={() => navigate('/auth')}
          onMouseEnter={() => setHoveredLink('login')}
          onMouseLeave={() => setHoveredLink(null)}
          style={{
            padding: '8px 20px',
            background: 'transparent',
            border: `1.5px solid ${hoveredLink === 'login' ? colors.brand : colors.borderMedium}`,
            borderRadius: 10,
            fontSize: 14,
            color: colors.brand,
            cursor: 'pointer',
            fontFamily: 'sans-serif',
            fontWeight: 500,
            transition: 'all 0.15s',
          }}
        >
          Login
        </button>

        {/* Register CTA */}
        <button
          onClick={() => navigate('/register')}
          onMouseEnter={() => setHoveredLink('cta')}
          onMouseLeave={() => setHoveredLink(null)}
          style={{
            padding: '8px 20px',
            background: hoveredLink === 'cta'
              ? 'linear-gradient(135deg, #3B6AFF 0%, #6B3EFF 100%)'
              : colors.gradientBrand,
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'sans-serif',
            fontWeight: 600,
            marginLeft: 8,
            transition: 'all 0.2s',
            boxShadow: hoveredLink === 'cta' ? '0 4px 16px rgba(79,125,243,0.4)' : 'none',
          }}
        >
          Register Artist
        </button>
      </div>
    </nav>
  )
}
