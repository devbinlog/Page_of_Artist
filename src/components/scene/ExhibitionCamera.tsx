import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cameraDragState } from '@/utils/cameraState'
import { useStore } from '@/store/useStore'

interface ExhibitionCameraProps {
  initialRadius?: number
  initialTheta?: number   // 수평 시작각
  initialPhi?: number     // 수직 시작각 (elevation)
  minRadius?: number
  maxRadius?: number
  hoverStrength?: number  // 마우스 hover 시 카메라 흔들림 강도
  orbitSensitivity?: number
  zoomThreshold?: number  // 이 radius 이하면 "줌됨" 상태
}

// 전시관 카메라
// - 마우스 이동: hover parallax (시점이 자연스럽게 따라옴)
// - 좌클릭 드래그: 카메라 공전 (수평/수직)
// - 스크롤: 줌 인/아웃
export function ExhibitionCamera({
  initialRadius = 8,
  initialTheta = 0,
  initialPhi = 0.1,
  minRadius = 4,
  maxRadius = 15,
  hoverStrength = 0.45,
  orbitSensitivity = 0.007,
  zoomThreshold,
}: ExhibitionCameraProps) {
  const { camera } = useThree()
  const setIsCardZoomed = useStore((s) => s.setIsCardZoomed)

  // 현재 카메라 구형좌표 (lerp 적용됨)
  const thetaRef = useRef(initialTheta)
  const phiRef = useRef(initialPhi)
  const radiusRef = useRef(initialRadius)

  // 드래그로 누적된 공전 오프셋 (지속됨)
  const orbitThetaRef = useRef(0)
  const orbitPhiRef = useRef(0)

  // hover로 인한 순간 오프셋 (마우스 위치에 따라 실시간 변화)
  const hoverThetaRef = useRef(0)
  const hoverPhiRef = useRef(0)

  // zoom 목표값
  const targetRadiusRef = useRef(initialRadius)

  // 드래그 추적
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastPosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPosRef.current.x
      const dy = e.clientY - lastPosRef.current.y

      if (isDraggingRef.current) {
        const totalMoved =
          Math.abs(e.clientX - dragStartRef.current.x) +
          Math.abs(e.clientY - dragStartRef.current.y)
        if (totalMoved > 5) cameraDragState.hasDragged = true

        // 드래그: 수평 공전 + 수직 각도
        orbitThetaRef.current -= dx * orbitSensitivity
        orbitPhiRef.current = THREE.MathUtils.clamp(
          orbitPhiRef.current + dy * orbitSensitivity * 0.6,
          -0.45,
          0.55
        )
      } else {
        // hover: 마우스 중심 기준 -1~1 정규화 후 strength 적용
        hoverThetaRef.current = (e.clientX / window.innerWidth - 0.5) * hoverStrength
        hoverPhiRef.current = -(e.clientY / window.innerHeight - 0.5) * hoverStrength * 0.5
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY }
    }

    const onDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDraggingRef.current = true
        cameraDragState.hasDragged = false
        dragStartRef.current = { x: e.clientX, y: e.clientY }
        lastPosRef.current = { x: e.clientX, y: e.clientY }
        document.body.style.cursor = 'grabbing'
      }
    }

    const onUp = (e: MouseEvent) => {
      if (e.button === 0) {
        isDraggingRef.current = false
        document.body.style.cursor = ''
        // 클릭 이벤트가 먼저 처리된 후 플래그 리셋
        setTimeout(() => { cameraDragState.hasDragged = false }, 150)
      }
    }

    const onWheel = (e: WheelEvent) => {
      targetRadiusRef.current = THREE.MathUtils.clamp(
        targetRadiusRef.current + e.deltaY * 0.013,
        minRadius,
        maxRadius
      )
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('wheel', onWheel)
      document.body.style.cursor = ''
    }
  }, [minRadius, maxRadius, orbitSensitivity, hoverStrength])

  const isZoomedRef = useRef(false)
  useFrame(() => {
    // hover + drag orbit 합산해서 lerp
    const targetTheta = orbitThetaRef.current + hoverThetaRef.current
    const targetPhi = orbitPhiRef.current + hoverPhiRef.current + initialPhi

    thetaRef.current = THREE.MathUtils.lerp(thetaRef.current, targetTheta, 0.05)
    phiRef.current = THREE.MathUtils.lerp(phiRef.current, targetPhi, 0.05)
    radiusRef.current = THREE.MathUtils.lerp(radiusRef.current, targetRadiusRef.current, 0.07)

    // 줌 임계값 감지 → store 업데이트 (매 프레임 set 방지)
    if (zoomThreshold !== undefined) {
      const zoomed = radiusRef.current < zoomThreshold
      if (zoomed !== isZoomedRef.current) {
        isZoomedRef.current = zoomed
        setIsCardZoomed(zoomed)
      }
    }

    // 구형 → 직교 좌표 변환
    const cosPhi = Math.cos(phiRef.current)
    camera.position.set(
      radiusRef.current * Math.sin(thetaRef.current) * cosPhi,
      radiusRef.current * Math.sin(phiRef.current),
      radiusRef.current * Math.cos(thetaRef.current) * cosPhi
    )
    camera.lookAt(0, 0, 0)
  })

  return null
}
