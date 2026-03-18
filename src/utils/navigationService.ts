import type { NavigateFunction } from 'react-router-dom'

// React 컴포넌트 외부(Zustand, hooks)에서 React Router navigate를 사용하기 위한 전역 레퍼런스
let _navigate: NavigateFunction | null = null

export function setNavigate(fn: NavigateFunction) {
  _navigate = fn
}

export function navigateTo(path: string) {
  _navigate?.(path)
}
