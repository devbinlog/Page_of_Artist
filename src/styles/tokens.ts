// Design tokens — color, spacing, radius, shadow
// Updated to premium light design system

export const colors = {
  // ── Primary Accents ─────────────────────────────────────
  brand:          '#4F7DF3',   // electric blue (primary)
  brandPurple:    '#7C5CFF',   // soft purple
  brandCoral:     '#FF6B6B',   // coral accent
  brandDark:      '#3B6AFF',   // darker blue (legacy compat)

  // ── Backgrounds ─────────────────────────────────────────
  bgWhite:        '#FFFFFF',
  bgLight:        '#F5F7FA',
  bgSection:      '#FAFBFF',
  bgDark:         'linear-gradient(135deg, #0f0c29 0%, #1a1740 50%, #0f1520 100%)',

  // ── Surfaces ────────────────────────────────────────────
  surfaceWhite:   '#FFFFFF',
  surfaceLight:   'rgba(255,255,255,0.9)',
  surfaceDark:    'rgba(13,20,55,0.85)',
  surfaceDarkAlt: 'rgba(255,255,255,0.04)',

  // ── Borders ─────────────────────────────────────────────
  borderLight:    'rgba(79,125,243,0.12)',
  borderMedium:   'rgba(79,125,243,0.28)',
  borderSoft:     'rgba(0,0,0,0.06)',
  borderDark:     'rgba(108,142,255,0.25)',
  borderDarkAlt:  'rgba(108,142,255,0.18)',

  // ── Text ────────────────────────────────────────────────
  textPrimary:    '#1E1E1E',
  textSecondary:  '#6A6A6A',
  textMuted:      '#9CA3AF',
  textDim:        '#6B80A8',
  textWhite:      '#FFFFFF',
  textBlue:       '#4F7DF3',
  textDark:       '#1e3a6e',

  // ── Gradients ───────────────────────────────────────────
  gradientBrand:  'linear-gradient(135deg, #4F7DF3 0%, #7C5CFF 100%)',
  gradientHero:   'linear-gradient(135deg, #F5F7FA 0%, #EEF2FF 100%)',
  gradientLight:  'linear-gradient(160deg, #f0f6ff 0%, #dbeafe 60%, #ede9ff 100%)',
} as const

export const radius = {
  xs:   6,
  sm:   8,
  md:   12,
  lg:   20,
  xl:   24,
  pill: 999,
} as const

export const shadow = {
  card:      '0px 10px 30px rgba(0,0,0,0.08)',
  cardHover: '0px 20px 40px rgba(79,125,243,0.16)',
  nav:       '0 1px 0 rgba(0,0,0,0.06)',
  panel:     '4px 0 24px rgba(0,0,0,0.06)',
  modal:     '0 24px 64px rgba(0,0,0,0.12)',
  brand:     '0 4px 16px rgba(79,125,243,0.35)',
  sm:        '0 2px 8px rgba(0,0,0,0.06)',
} as const

// ── Button styles ────────────────────────────────────────
export const btnStyles = {
  primary: {
    padding: '13px 32px',
    background: '#4F7DF3',
    border: 'none',
    borderRadius: 12,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  primaryPurple: {
    padding: '13px 32px',
    background: 'linear-gradient(135deg, #4F7DF3 0%, #7C5CFF 100%)',
    border: 'none',
    borderRadius: 12,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  secondary: {
    padding: '13px 32px',
    background: 'transparent',
    border: '1.5px solid rgba(79,125,243,0.35)',
    borderRadius: 12,
    color: '#4F7DF3',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  nav: {
    padding: '8px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    color: '#6A6A6A',
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    fontWeight: 500,
    transition: 'color 0.15s',
  } as React.CSSProperties,

  navDark: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(79,125,243,0.25)',
    borderRadius: 20,
    fontSize: 13,
    color: '#8892B0',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    fontFamily: 'sans-serif',
  } as React.CSSProperties,

  chip: {
    padding: '7px 18px',
    background: '#FFFFFF',
    border: '1.5px solid rgba(79,125,243,0.2)',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    color: '#4F7DF3',
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    transition: 'all 0.15s',
  } as React.CSSProperties,
} as const

// ── Input styles ─────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  fontSize: 14,
  border: '1.5px solid rgba(79,125,243,0.2)',
  borderRadius: 10,
  background: '#FFFFFF',
  color: '#1E1E1E',
  outline: 'none',
  fontFamily: 'sans-serif',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

// ── Layout constants ─────────────────────────────────────
export const layout = {
  navHeight:    80,
  maxWidth:     1400,
  marginX:      120,
  marginXSm:    48,
  gutter:       24,
  sectionPadY:  80,
} as const
