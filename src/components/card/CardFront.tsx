import { Text, RoundedBox } from '@react-three/drei'
import { CardParallaxLayer } from './CardParallax'
import { useTextureSafe } from '@/hooks/useTextureSafe'

export const CARD_W = 2.6
export const CARD_H = 4.0

const FONT_LABEL = '/Montserrat-SemiBold.ttf'
const FONT_BODY  = '/Montserrat-Regular.ttf'

interface CardFrontProps {
  artistName: string
  genres: string[]
  imageUrl: string
  featuredTrackName: string
  featuredTrackYoutubeUrl: string
  albumImageUrl: string
  tiltRef: React.MutableRefObject<{ x: number; y: number }>
}

// ─ 레이아웃 상수 ─────────────────────────────────────
// 카드: y +2.0(상단) ~ -2.0(하단)
// ART 줄여서 텍스트 영역 더 확보
const ART   = 1.90
const BAR_W = CARD_W - 0.50   // 2.10
const BAR_L = -BAR_W / 2
const PROG  = 0.25
const DOT_X = BAR_L + BAR_W * PROG

// y 배치 (검증)
//   아트: Y_ART±ART/2 = 0.82±0.95 → top=1.77, bottom=-0.13  ✓ (카드 ±2.0 이내)
//   트랙 top=-0.28, 2줄 하단=-0.28-0.37=-0.65  (lineHeight=1.25, 2줄)
//   아티스트 middle=-0.82, top=-0.759  ← gap=0.109 ✓
//   아티스트 bottom=-0.881
//   장르 middle=-0.97, top=-0.934  ← gap=0.053 ✓
//   장르 bottom=-1.006
//   프로그레스 -1.20  ← gap=0.194 ✓
//   컨트롤 -1.65  bottom≈-1.808  ← 카드 하단 -2.0, 여백 0.192 ✓
const Y_ART      =  0.82
const Y_TRACK    = -0.28   // anchorY="top"
const Y_ARTIST   = -0.82   // anchorY="middle"
const Y_GENRE    = -0.97   // anchorY="middle"
const Y_HEART    = -0.35   // anchorY="middle"
const Y_BAR      = -1.20
const Y_CONTROLS = -1.65

export function CardFront({
  artistName,
  genres,
  imageUrl,
  featuredTrackName,
  featuredTrackYoutubeUrl,
  albumImageUrl,
  tiltRef,
}: CardFrontProps) {
  // imageUrl (Wikimedia/picsum) supports CORS; albumImageUrl (mzstatic) may block CORS
  const albumTex = useTextureSafe(imageUrl || albumImageUrl || '')

  return (
    <group>

      {/* ─── 다크 글라스 배경 ───
          밝은 배경 위에서도 흰 텍스트가 보이도록 어두운 불투명 배경 사용 */}
      <CardParallaxLayer tiltRef={tiltRef} depth={0} parallaxStrength={0.008}>
        <RoundedBox args={[CARD_W, CARD_H, 0.04]} radius={0.12} smoothness={4}>
          <meshBasicMaterial color="#0c1f3f" transparent opacity={0.88} />
        </RoundedBox>
        {/* 안쪽 하이라이트 */}
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[CARD_W - 0.12, CARD_H - 0.12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
        </mesh>
      </CardParallaxLayer>

      {/* ─── 앨범 아트 ───
          • z=0.05: 카드 전면(z≈0.02)보다 확실히 앞
          • key 로 texture 유무 전환 시 material 완전 재생성
            → R3F prop 잔류(color/opacity/transparent) 버그 방지
          • renderOrder=10: 투명 오버레이보다 항상 나중에 렌더 */}
      <group position={[0, Y_ART, 0.05]}>
        <mesh renderOrder={10}>
          <planeGeometry args={[ART, ART]} />
          {albumTex
            ? <meshBasicMaterial key="img-loaded" map={albumTex} color="#ffffff" />
            : <meshBasicMaterial key="img-pending" color="#1a3060" transparent opacity={0.60} />
          }
        </mesh>
        {/* 앨범 아트 테두리 glow */}
        <mesh position={[0, 0, -0.003]} renderOrder={9}>
          <planeGeometry args={[ART + 0.04, ART + 0.04]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
        </mesh>
      </group>

      {/* ─── 텍스트 영역 ─── */}
      <CardParallaxLayer tiltRef={tiltRef} depth={2} parallaxStrength={0.022}>

        {/* 트랙명 — 최대 2줄, maxWidth로 줄바꿈 */}
        <Text
          font={FONT_LABEL}
          sdfGlyphSize={128}
          position={[-(CARD_W / 2 - 0.22), Y_TRACK, 0.055]}
          fontSize={0.145}
          lineHeight={1.25}
          letterSpacing={0.005}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          maxWidth={CARD_W - 1.00}
          onClick={(e) => {
            e.stopPropagation()
            if (featuredTrackYoutubeUrl) window.open(featuredTrackYoutubeUrl, '_blank', 'noopener')
          }}
        >
          {featuredTrackName}
        </Text>

        {/* 아티스트명 */}
        <Text
          font={FONT_BODY}
          sdfGlyphSize={128}
          position={[-(CARD_W / 2 - 0.22), Y_ARTIST, 0.055]}
          fontSize={0.118}
          letterSpacing={0.01}
          color="#d8e8ff"
          anchorX="left"
          anchorY="middle"
          maxWidth={CARD_W - 1.00}
        >
          {artistName}
        </Text>

        {/* 장르 태그 */}
        {genres.length > 0 && (
          <Text
            font={FONT_BODY}
            sdfGlyphSize={64}
            position={[-(CARD_W / 2 - 0.22), Y_GENRE, 0.055]}
            fontSize={0.068}
            letterSpacing={0.09}
            color="#a0b8dc"
            anchorX="left"
            anchorY="middle"
            maxWidth={CARD_W - 1.00}
          >
            {genres.slice(0, 2).map(g => g.toUpperCase()).join('  ·  ')}
          </Text>
        )}

        {/* 하트 */}
        <Text
          font={FONT_BODY}
          sdfGlyphSize={64}
          position={[CARD_W / 2 - 0.26, Y_HEART, 0.055]}
          fontSize={0.185}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {'\u2665'}
        </Text>

      </CardParallaxLayer>

      {/* ─── 프로그레스 바 ─── */}
      <CardParallaxLayer tiltRef={tiltRef} depth={1} parallaxStrength={0.016}>
        {/* 배경 트랙 */}
        <mesh position={[0, Y_BAR, 0.055]}>
          <planeGeometry args={[BAR_W, 0.007]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.30} />
        </mesh>
        {/* 재생된 부분 */}
        <mesh position={[BAR_L + (BAR_W * PROG) / 2, Y_BAR, 0.056]}>
          <planeGeometry args={[BAR_W * PROG, 0.010]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.90} />
        </mesh>
        {/* 재생 위치 점 */}
        <mesh position={[DOT_X, Y_BAR, 0.057]}>
          <circleGeometry args={[0.028, 20]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </CardParallaxLayer>

      {/* ─── 플레이어 컨트롤 ─── */}
      <CardParallaxLayer tiltRef={tiltRef} depth={2} parallaxStrength={0.026}>
        <group position={[0, Y_CONTROLS, 0.060]}>

          {/* 셔플 */}
          <group position={[-0.86, 0, 0]}>
            <mesh rotation={[0, 0, 0.52]}>
              <planeGeometry args={[0.24, 0.013]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.72} />
            </mesh>
            <mesh rotation={[0, 0, -0.52]}>
              <planeGeometry args={[0.24, 0.013]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.72} />
            </mesh>
          </group>

          {/* 이전 곡 */}
          <group position={[-0.44, 0, 0]}>
            <mesh position={[-0.095, 0, 0]}>
              <planeGeometry args={[0.016, 0.175]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <Text
              font={FONT_LABEL} sdfGlyphSize={64}
              position={[0.016, 0, 0.001]} fontSize={0.150}
              color="#ffffff" anchorX="center" anchorY="middle"
            >{'◀'}</Text>
          </group>

          {/* 재생 버튼 */}
          <group position={[0, 0, 0]}>
            <mesh>
              <ringGeometry args={[0.142, 0.170, 32]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.90} />
            </mesh>
            <Text
              font={FONT_LABEL} sdfGlyphSize={64}
              position={[0.018, 0, 0.001]} fontSize={0.155}
              color="#ffffff" anchorX="center" anchorY="middle"
            >{'▶'}</Text>
          </group>

          {/* 다음 곡 */}
          <group position={[0.44, 0, 0]}>
            <Text
              font={FONT_LABEL} sdfGlyphSize={64}
              position={[-0.016, 0, 0.001]} fontSize={0.150}
              color="#ffffff" anchorX="center" anchorY="middle"
            >{'▶'}</Text>
            <mesh position={[0.095, 0, 0]}>
              <planeGeometry args={[0.016, 0.175]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* 반복 */}
          <group position={[0.86, 0, 0]}>
            <mesh rotation={[0, 0, -0.3]}>
              <torusGeometry args={[0.076, 0.013, 8, 32, Math.PI * 1.65]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.72} />
            </mesh>
          </group>

        </group>
      </CardParallaxLayer>

    </group>
  )
}
