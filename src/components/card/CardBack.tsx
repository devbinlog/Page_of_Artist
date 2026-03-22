import { useState, useEffect } from 'react'
import { Text, RoundedBox } from '@react-three/drei'
import type { Track } from '@/types/artist'
import { extractAlbumColorLight } from '@/utils/colorExtract'
import { useTextureSafe } from '@/hooks/useTextureSafe'
import { CARD_W, CARD_H } from './CardFront'

const FONT_DISPLAY = '/Playfair-Bold.ttf'
const FONT_LABEL   = '/Montserrat-SemiBold.ttf'
const FONT_BODY    = '/Montserrat-Regular.ttf'

const MAX_VISIBLE_TRACKS = 7
const TRACK_SPACING = 0.215

interface CardBackProps {
  albumName: string
  albumYoutubeUrl: string
  albumImageUrl: string
  imageUrl?: string
  tracks: Track[]
}

export function CardBack({ albumName, albumYoutubeUrl, albumImageUrl, imageUrl, tracks }: CardBackProps) {
  const [bgColor, setBgColor] = useState('#dceaff')

  useEffect(() => {
    if (!albumImageUrl) return
    extractAlbumColorLight(albumImageUrl).then(([c1]) => setBgColor(c1))
  }, [albumImageUrl])

  // imageUrl (Wikimedia/picsum) supports CORS; albumImageUrl (mzstatic) may block CORS
  const albumTex = useTextureSafe(imageUrl || albumImageUrl || '')
  const visibleTracks = tracks.slice(0, MAX_VISIBLE_TRACKS)

  // 앨범 아트 크기 축소 (1.50 → 1.25) — 트랙 리스트 공간 확보
  const ART = 1.25

  return (
    <group>

      {/* ─── 배경 ─── */}
      <RoundedBox args={[CARD_W, CARD_H, 0.04]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color={bgColor} transparent opacity={0.92}
          metalness={0.12} roughness={0.08}
        />
      </RoundedBox>
      {albumTex && (
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[CARD_W - 0.08, CARD_H - 0.08]} />
          <meshBasicMaterial map={albumTex} transparent opacity={0.055} />
        </mesh>
      )}

      {/* ─── 상단 accent bar ─── */}
      <mesh position={[0, CARD_H / 2 - 0.16, 0.026]}>
        <planeGeometry args={[CARD_W - 0.28, 0.025]} />
        <meshBasicMaterial color="#3B6AFF" transparent opacity={0.75} />
      </mesh>

      {/* ─── 앨범 이름 헤더 ─── */}
      <group
        position={[0, 1.60, 0.03]}
        onClick={(e) => {
          e.stopPropagation()
          if (albumYoutubeUrl) window.open(albumYoutubeUrl, '_blank', 'noopener')
        }}
      >
        <mesh position={[0, 0.02, -0.003]}>
          <planeGeometry args={[CARD_W - 0.16, 0.50]} />
          <meshBasicMaterial color="#3B6AFF" transparent opacity={0.08} />
        </mesh>
        <Text
          font={FONT_DISPLAY}
          sdfGlyphSize={128}
          position={[0, 0.10, 0]}
          fontSize={0.155}
          letterSpacing={0.0}
          color="#1e3a6e"
          anchorX="center"
          anchorY="middle"
          maxWidth={CARD_W - 0.28}
        >
          {albumName}
        </Text>
        {albumYoutubeUrl && (
          <group position={[0, -0.14, 0]}>
            <mesh position={[0, 0, -0.001]}>
              <planeGeometry args={[0.72, 0.20]} />
              <meshBasicMaterial color="#3B6AFF" transparent opacity={0.12} />
            </mesh>
            <Text
              font={FONT_LABEL}
              sdfGlyphSize={128}
              fontSize={0.082}
              letterSpacing={0.08}
              color="#3B6AFF"
              anchorX="center"
              anchorY="middle"
            >
              {`\u25B6  YOUTUBE`}
            </Text>
          </group>
        )}
      </group>

      {/* 헤더 아래 구분선 */}
      <mesh position={[0, 1.34, 0.026]}>
        <planeGeometry args={[CARD_W - 0.34, 0.010]} />
        <meshBasicMaterial color="#6C8EFF" transparent opacity={0.30} />
      </mesh>

      {/* ─── 앨범 아트 (크기 축소: 1.25) ─── */}
      <group position={[0, 0.46, 0]}>
        {/* 외곽 glow */}
        <RoundedBox
          args={[ART + 0.07, ART + 0.07, 0.018]}
          radius={0.07} smoothness={4}
          position={[0, 0, 0.016]}
        >
          <meshBasicMaterial color="#6C8EFF" transparent opacity={0.20} />
        </RoundedBox>
        {/* 프레임 */}
        <RoundedBox
          args={[ART, ART, 0.034]}
          radius={0.06} smoothness={4}
          position={[0, 0, 0.020]}
        >
          <meshStandardMaterial
            color="#dbeafe" transparent opacity={0.96}
            metalness={0.08} roughness={0.1}
          />
        </RoundedBox>
        {/* 이미지 — key로 material 완전 재생성 (stale prop 방지) */}
        <mesh position={[0, 0, 0.040]}>
          <planeGeometry args={[ART - 0.07, ART - 0.07]} />
          {albumTex
            ? <meshBasicMaterial key="back-img-loaded" map={albumTex} color="#ffffff" />
            : <meshBasicMaterial key="back-img-pending" color="#c8d8f0" transparent opacity={0.5} />
          }
        </mesh>
      </group>

      {/* 아트 아래 구분선 */}
      <mesh position={[0, -0.20, 0.026]}>
        <planeGeometry args={[CARD_W - 0.38, 0.010]} />
        <meshBasicMaterial color="#6C8EFF" transparent opacity={0.22} />
      </mesh>

      {/* "TRACKLIST" 레이블 */}
      <Text
        font={FONT_LABEL}
        sdfGlyphSize={128}
        position={[-(CARD_W / 2 - 0.18), -0.30, 0.026]}
        fontSize={0.068}
        letterSpacing={0.14}
        color="#3B5FA0"
        anchorX="left"
        anchorY="middle"
      >
        TRACKLIST
      </Text>

      {/* ─── 트랙 리스트 (y=-0.44 시작, 간격 0.215) ─── */}
      {/* Track 0: y=-0.44 / Track 6: y=-0.44-1.29=-1.73 → 카드 bottom(-2.0) 안에 들어옴 */}
      <group position={[0, -0.44, 0.028]}>
        {visibleTracks.map((track, i) => (
          <group key={`${track.number}-${i}`} position={[0, -i * TRACK_SPACING, 0]}>
            {/* 짝수 행 배경 */}
            {i % 2 === 0 && (
              <mesh position={[0, 0, -0.002]}>
                <planeGeometry args={[CARD_W - 0.18, 0.192]} />
                <meshBasicMaterial color="#3B6AFF" transparent opacity={0.03} />
              </mesh>
            )}
            {/* 트랙 번호 */}
            <Text
              font={FONT_LABEL}
              sdfGlyphSize={128}
              position={[-(CARD_W / 2 - 0.18), 0, 0.002]}
              fontSize={0.076}
              letterSpacing={0.04}
              color="#3B6AFF"
              anchorX="center"
              anchorY="middle"
            >
              {String(track.number).padStart(2, '0')}
            </Text>
            {/* 트랙 이름 */}
            <Text
              font={FONT_BODY}
              sdfGlyphSize={128}
              position={[-(CARD_W / 2 - 0.38), 0, 0.002]}
              fontSize={0.092}
              letterSpacing={0.01}
              color="#0d1f4a"
              anchorX="left"
              anchorY="middle"
              maxWidth={CARD_W - 0.52}
            >
              {track.name}
            </Text>
          </group>
        ))}

        {tracks.length > MAX_VISIBLE_TRACKS && (
          <Text
            font={FONT_LABEL}
            sdfGlyphSize={128}
            position={[0, -(MAX_VISIBLE_TRACKS) * TRACK_SPACING + 0.04, 0.002]}
            fontSize={0.082}
            letterSpacing={0.06}
            color="#6C8EFF"
            anchorX="center"
            anchorY="middle"
          >
            {`+ ${tracks.length - MAX_VISIBLE_TRACKS} MORE`}
          </Text>
        )}
      </group>

    </group>
  )
}
