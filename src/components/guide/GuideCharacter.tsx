import { useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useGuideDialogue } from '@/hooks/useGuideDialogue'
import type { EmotionState } from '@/hooks/useGuideDialogue'
import { useStore } from '@/store/useStore'
import './GuideCharacter.css'

// ─── SVG Character — Headphone DJ / Music Curator ───────────────────────────
// 젊고 세련된 헤드폰 착용 음악 큐레이터 캐릭터
// 브랜드 색상 (#4F7DF3 blue, #7C5CFF purple) 활용
function MusicCuratorSVG({ emotion }: { emotion: EmotionState }) {
  const isExcited = emotion === 'excited'
  const isTalking = emotion === 'talking' || isExcited

  // 눈 크기
  const eyeRx = isExcited ? 3.4 : 2.6
  const eyeRy = isExcited ? 3.6 : 2.8

  // 입 모양
  const mouthPath = isTalking
    ? 'M33 37 Q40 44 47 37'   // 크게 벌린 미소
    : 'M35 37 Q40 41 45 37'   // 부드러운 미소

  const browLift = isExcited ? -2 : 0

  return (
    <svg
      width="80" height="108"
      viewBox="0 0 80 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ── Drop shadow ── */}
      <ellipse cx="40" cy="105" rx="22" ry="4" fill="rgba(0,0,0,0.09)" />

      {/* ── Legs ── */}
      <rect x="26" y="82" width="11" height="20" rx="4.5" fill="#2D3748" />
      <rect x="43" y="82" width="11" height="20" rx="4.5" fill="#2D3748" />

      {/* Shoes ── 사각 스니커즈 스타일 */}
      <rect x="22" y="96" width="17" height="8" rx="4" fill="#1A202C" />
      <rect x="41" y="96" width="17" height="8" rx="4" fill="#1A202C" />
      {/* Shoe highlight */}
      <rect x="24" y="97" width="8" height="2" rx="1" fill="#2D3748" opacity="0.6" />
      <rect x="43" y="97" width="8" height="2" rx="1" fill="#2D3748" opacity="0.6" />

      {/* ── Body — brand blue hoodie ── */}
      <rect x="15" y="50" width="50" height="36" rx="11" fill="#4F7DF3" />

      {/* Hoodie pocket */}
      <rect x="28" y="68" width="24" height="14" rx="5" fill="rgba(0,0,0,0.12)" />
      <rect x="39" y="68" width="1.5" height="14" rx="0.75" fill="rgba(255,255,255,0.15)" />

      {/* Hoodie drawstring */}
      <circle cx="35" cy="56" r="1.5" fill="rgba(255,255,255,0.4)" />
      <circle cx="45" cy="56" r="1.5" fill="rgba(255,255,255,0.4)" />
      <path d="M35 56 Q37 60 39.5 61 Q40.5 61 42 61 Q44 60 45 56"
        stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* ── Left arm ── */}
      <path d="M15 58 Q4 65 6 78" stroke="#F4C9A0" strokeWidth="9" strokeLinecap="round" />
      {/* Left hand */}
      <circle cx="6" cy="81" r="5.5" fill="#F4C9A0" />

      {/* ── Right arm + vinyl record ── */}
      <path d="M65 58 Q76 65 74 78" stroke="#F4C9A0" strokeWidth="9" strokeLinecap="round" />
      {/* Vinyl record */}
      <circle cx="74" cy="84" r="10" fill="#1A202C" />
      <circle cx="74" cy="84" r="7"  fill="#2D3748" />
      <circle cx="74" cy="84" r="4"  fill="#4F7DF3" opacity="0.7" />
      <circle cx="74" cy="84" r="1.8" fill="#fff" opacity="0.9" />
      {/* Vinyl grooves */}
      <circle cx="74" cy="84" r="9"   stroke="#4F7DF3" strokeWidth="0.4" fill="none" opacity="0.3" />
      <circle cx="74" cy="84" r="7.8" stroke="#7C5CFF" strokeWidth="0.4" fill="none" opacity="0.3" />
      <circle cx="74" cy="84" r="6.5" stroke="#4F7DF3" strokeWidth="0.4" fill="none" opacity="0.3" />

      {/* ── Neck ── */}
      <rect x="33" y="44" width="14" height="10" rx="5" fill="#F4C9A0" />

      {/* ── Head ── */}
      <circle cx="40" cy="27" r="21" fill="#F4C9A0" />

      {/* Ears */}
      <ellipse cx="19.5" cy="27" rx="3.5" ry="4.5" fill="#EAB890" />
      <ellipse cx="60.5" cy="27" rx="3.5" ry="4.5" fill="#EAB890" />

      {/* ── Hair — short dark hair ── */}
      <path d="M19 25 Q19 7 40 7 Q61 7 61 25 Q58 12 54 10 Q48 8 40 8 Q32 8 26 10 Q22 12 19 25Z"
        fill="#2D2D3A" />
      {/* Side sideburns */}
      <path d="M19 25 Q18 32 20 38 Q21 34 22 28Z" fill="#2D2D3A" />
      <path d="M61 25 Q62 32 60 38 Q59 34 58 28Z" fill="#2D2D3A" />
      {/* Hair shine */}
      <path d="M32 9 Q34 14 34 19 Q36 11 34 8Z" fill="#4A4A5A" opacity="0.5" />

      {/* ── Headphone band ── */}
      <path d="M19 27 Q19 4 40 4 Q61 4 61 27"
        stroke="#7C5CFF" strokeWidth="5.5" fill="none" strokeLinecap="round" />

      {/* Headphone left ear cup */}
      <ellipse cx="19" cy="27" rx="7" ry="9"   fill="#4F7DF3" />
      <ellipse cx="19" cy="27" rx="4.5" ry="5.5" fill="#7C5CFF" />
      <ellipse cx="19" cy="27" rx="2" ry="2.5"  fill="#A78BFA" opacity="0.6" />

      {/* Headphone right ear cup */}
      <ellipse cx="61" cy="27" rx="7" ry="9"   fill="#4F7DF3" />
      <ellipse cx="61" cy="27" rx="4.5" ry="5.5" fill="#7C5CFF" />
      <ellipse cx="61" cy="27" rx="2" ry="2.5"  fill="#A78BFA" opacity="0.6" />

      {/* ── Eyes ── */}
      <ellipse cx="33" cy="27" rx={eyeRx} ry={eyeRy} fill="#1A1A2E" />
      <ellipse cx="47" cy="27" rx={eyeRx} ry={eyeRy} fill="#1A1A2E" />
      {/* Eye highlights */}
      <circle cx="34.5" cy="25.5" r="1.1" fill="white" opacity="0.85" />
      <circle cx="48.5" cy="25.5" r="1.1" fill="white" opacity="0.85" />
      {/* Small second highlight */}
      <circle cx="35.5" cy="27.8" r="0.6" fill="white" opacity="0.4" />
      <circle cx="49.5" cy="27.8" r="0.6" fill="white" opacity="0.4" />

      {/* ── Eyebrows ── */}
      <path d={`M28 ${20 + browLift} Q33 ${17 + browLift} 38 ${19 + browLift}`}
        stroke="#2D2D3A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M42 ${19 + browLift} Q47 ${17 + browLift} 52 ${20 + browLift}`}
        stroke="#2D2D3A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* ── Mouth ── */}
      <path d={mouthPath}
        stroke="#C07858" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Smile dimples */}
      <circle cx="30" cy="36" r="1" fill="#E8A888" opacity="0.4" />
      <circle cx="50" cy="36" r="1" fill="#E8A888" opacity="0.4" />

      {/* ── Cheek blush ── */}
      <ellipse cx="26" cy="32" rx="5" ry="3" fill="#F4A0A0" opacity="0.2" />
      <ellipse cx="54" cy="32" rx="5" ry="3" fill="#F4A0A0" opacity="0.2" />

      {/* ── Sound wave indicator (excited state only) ── */}
      {isExcited && (
        <>
          <path d="M2 50 Q3 46 2 42" stroke="#4F7DF3" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M5 52 Q7 46 5 40" stroke="#7C5CFF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
        </>
      )}
    </svg>
  )
}

// ─── Speech Bubble ──────────────────────────────────────────────────────────
function SpeechBubble({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="guide-bubble" role="dialog" aria-label="가이드 메시지">
      <button className="guide-bubble-close" onClick={onClose} aria-label="닫기">×</button>
      <p className="guide-bubble-text">{message}</p>
      <div className="guide-bubble-tail" />
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function GuideCharacter() {
  const { message, emotion, showBubble, dismiss, trigger } = useGuideDialogue()
  const [minimised, setMinimised] = useState(false)
  const location = useLocation()
  const isCardZoomed = useStore((s) => s.isCardZoomed)

  const isArtistPage  = location.pathname.startsWith('/artist')
  const isGalleryPage = location.pathname === '/gallery'

  const handleCharacterClick = useCallback(() => {
    if (minimised) {
      setMinimised(false)
      return
    }
    if (showBubble) {
      dismiss()
    } else {
      trigger('어서오세요! 🎧 아티스트를 탐색해보세요. 카드를 클릭하면 상세 정보를 볼 수 있어요!', 'excited')
    }
  }, [minimised, showBubble, dismiss, trigger])

  // ArtistPage: 오른쪽 캔버스 영역 우측에 배치, 줌 시 더 오른쪽으로
  const artistPageStyle = isArtistPage ? {
    right: isCardZoomed ? 8 : 16,
    bottom: 24,
    transition: 'right 0.3s ease',
  } as React.CSSProperties : undefined

  return (
    <div
      className={[
        'guide-wrapper',
        isGalleryPage ? 'guide-gallery' : '',
        minimised     ? 'guide-minimised' : '',
      ].filter(Boolean).join(' ')}
      style={artistPageStyle}
      aria-live="polite"
    >
      {/* Speech bubble — shown above character */}
      {showBubble && !minimised && (
        <SpeechBubble message={message} onClose={dismiss} />
      )}

      {/* Character button */}
      <button
        className={[
          'guide-character-btn',
          emotion === 'talking' ? 'guide-talking'      : '',
          emotion === 'excited' ? 'guide-excited-anim' : '',
        ].filter(Boolean).join(' ')}
        onClick={handleCharacterClick}
        aria-label="가이드 캐릭터 — 클릭하면 말풍선이 열리거나 닫힙니다"
        title="클릭해서 가이드 열기 / 닫기"
      >
        <MusicCuratorSVG emotion={emotion} />

        {/* Notification dot (말풍선 닫혀있을 때만 표시) */}
        {!minimised && !showBubble && (
          <span className="guide-notification-dot" aria-hidden="true" />
        )}
      </button>

      {/* Minimise toggle */}
      <button
        className="guide-minimise-btn"
        onClick={() => setMinimised(v => !v)}
        aria-label={minimised ? '가이드 표시' : '가이드 숨기기'}
        title={minimised ? '가이드 표시' : '가이드 숨기기'}
      >
        {minimised ? '🎧' : '–'}
      </button>
    </div>
  )
}
