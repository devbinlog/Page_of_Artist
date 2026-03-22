import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export type EmotionState = 'idle' | 'talking' | 'excited'

interface GuideDialogue {
  message: string
  emotion: EmotionState
  isVisible: boolean
  showBubble: boolean
  dismiss: () => void
  trigger: (msg: string, emotion?: EmotionState) => void
}

// ─── 페이지별 메시지 ────────────────────────────────────────────────────────
const PAGE_MESSAGES: Record<string, { text: string; emotion: EmotionState }> = {
  '/': {
    text: '안녕하세요! 🎵 처음 방문하셨군요. 여기는 아티스트를 3D 카드로 탐색할 수 있는 뮤직 카페예요.',
    emotion: 'excited',
  },
  '/intro': {
    text: '마음에 드는 아티스트를 검색하거나, 아래 카드를 클릭해서 갤러리로 이동해보세요! ☕',
    emotion: 'talking',
  },
  '/gallery': {
    text: '카드를 드래그해서 회전해보세요. 원하는 아티스트를 찾을 수 있어요. 더블클릭하면 상세 페이지로!',
    emotion: 'talking',
  },
}

// 아티스트 페이지는 경로가 /artist/:id 이므로 prefix로 매칭
const ARTIST_MESSAGE = {
  text: '카드를 클릭하면 뒤집혀서 대표 앨범 트랙리스트를 볼 수 있어요. 더블클릭은 뒤집기 해제! 🎶',
  emotion: 'excited' as EmotionState,
}

// 일정 시간 비활성화 시 보여줄 메시지
const IDLE_MESSAGES = [
  { text: '아직 거기 계세요? 카드를 드래그해서 아티스트를 탐색해보세요 🎧', emotion: 'idle' as EmotionState },
  { text: '좋아하는 아티스트가 있나요? 검색창에 이름을 입력해보세요! 🔍', emotion: 'talking' as EmotionState },
  { text: '궁금한 게 있으시면 언제든 저를 클릭해서 물어보세요 ☕', emotion: 'idle' as EmotionState },
]

const BUBBLE_DURATION = 6000   // 말풍선 표시 시간 (ms)
const IDLE_TIMEOUT    = 30000  // 비활동 후 idle 메시지 타이밍 (ms)

export function useGuideDialogue(): GuideDialogue {
  const location = useLocation()

  const [message,    setMessage]    = useState('')
  const [emotion,    setEmotion]    = useState<EmotionState>('idle')
  const [showBubble, setShowBubble] = useState(false)
  const [isVisible,  setIsVisible]  = useState(true)

  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleIdx     = useRef(0)
  const hasShownInitial = useRef(false)

  // ── 말풍선 닫기 ────────────────────────────────────────────────────────────
  const closeBubble = useCallback(() => {
    setShowBubble(false)
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
  }, [])

  // ── 메시지 트리거 ──────────────────────────────────────────────────────────
  const trigger = useCallback((msg: string, emo: EmotionState = 'talking') => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)

    setMessage(msg)
    setEmotion(emo)
    setShowBubble(true)
    // 자동 닫힘 제거 — 사용자가 직접 클릭해야만 닫힘
  }, [])

  // ── Dismiss ────────────────────────────────────────────────────────────────
  const dismiss = useCallback(() => {
    closeBubble()
  }, [closeBubble])

  // ── 페이지 변경 시 메시지 표시 ─────────────────────────────────────────────
  useEffect(() => {
    const path = location.pathname

    // 첫 방문 딜레이 (빠른 첫 렌더 충돌 방지)
    const delay = hasShownInitial.current ? 400 : 1200
    hasShownInitial.current = true

    const t = setTimeout(() => {
      let entry: { text: string; emotion: EmotionState } | undefined

      if (path.startsWith('/artist/')) {
        entry = ARTIST_MESSAGE
      } else {
        entry = PAGE_MESSAGES[path]
      }

      if (entry) trigger(entry.text, entry.emotion)
    }, delay)

    return () => clearTimeout(t)
  }, [location.pathname, trigger])

  // ── 비활동 idle 메시지 ─────────────────────────────────────────────────────
  useEffect(() => {
    function resetIdleTimer() {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        const msg = IDLE_MESSAGES[idleIdx.current % IDLE_MESSAGES.length]
        idleIdx.current++
        trigger(msg.text, msg.emotion)
        // 재귀: 활동 없으면 계속
        resetIdleTimer()
      }, IDLE_TIMEOUT)
    }

    const events = ['mousemove', 'keydown', 'pointerdown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }))
    resetIdleTimer()

    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer))
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [trigger])

  // ── 언마운트 정리 ──────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
      if (idleTimer.current)   clearTimeout(idleTimer.current)
    }
  }, [])

  return { message, emotion, isVisible, showBubble, dismiss, trigger }
}
