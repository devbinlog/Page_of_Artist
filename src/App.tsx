import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { setNavigate } from '@/utils/navigationService'
import { useSpotify } from '@/hooks/useSpotify'
import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/pages/LoadingPage'
import { IntroPage } from '@/pages/IntroPage'
import { GalleryPage } from '@/pages/GalleryPage'
import { ArtistPage } from '@/pages/ArtistPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { AdminPage } from '@/pages/AdminPage'
import { AuthPage } from '@/pages/AuthPage'
import { ZoomTransition } from '@/components/transition/ZoomTransition'
import { GuideCharacter } from '@/components/guide/GuideCharacter'

// NavigationSetup: React Router의 navigate 함수를 전역으로 등록
// useSpotify 데이터 로딩도 여기서 실행 (Router 컨텍스트 내부이므로 navigate 사용 가능)
function NavigationSetup() {
  const navigate = useNavigate()
  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])
  useSpotify()
  useAuth()
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <NavigationSetup />
        <Routes>
          <Route path="/"          element={<LoadingPage />} />
          <Route path="/intro"     element={<IntroPage />} />
          <Route path="/gallery"   element={<GalleryPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/admin"     element={<AdminPage />} />
          <Route path="/auth"      element={<AuthPage />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
        {/* 줌 트랜지션 오버레이 — 모든 페이지 위에 렌더 */}
        <ZoomTransition />
        {/* 뮤직 카페 주인 가이드 캐릭터 — fixed overlay, z-index 9000 */}
        <GuideCharacter />
      </div>
    </BrowserRouter>
  )
}
