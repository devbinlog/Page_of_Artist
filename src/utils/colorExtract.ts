// 앨범 이미지에서 지배적 색상을 추출하는 유틸리티
// Canvas API를 사용하여 이미지를 8x8로 다운샘플링 후 평균 색상 계산
// Spotify CDN 이미지는 CORS를 허용하므로 crossOrigin='anonymous' 사용 가능

const colorCache = new Map<string, string>()

// 다크 글래스모피즘 테마용: 앨범 색상을 #0d0d1a에 혼합
// amount=0.82 → 82% 다크 배경 + 18% 앨범 색상 = 고유한 딥 다크 배경
function darkTintColor(r: number, g: number, b: number, amount = 0.82): string {
  const base = { r: 13, g: 13, b: 26 } // #0d0d1a
  const dr = Math.round(base.r + (r - base.r) * (1 - amount))
  const dg = Math.round(base.g + (g - base.g) * (1 - amount))
  const db = Math.round(base.b + (b - base.b) * (1 - amount))
  return `rgb(${dr},${dg},${db})`
}

// 이미지 URL에서 지배적 색상 추출
// 반환값: 다크 tint 처리된 rgb 문자열 (카드 배경용)
export async function extractAlbumColor(imageUrl: string): Promise<string> {
  if (!imageUrl) return 'rgb(13,20,55)'

  const cached = colorCache.get(imageUrl)
  if (cached) return cached

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        // 8x8로 다운샘플링하여 성능 최적화 + 노이즈 제거
        const canvas = document.createElement('canvas')
        canvas.width = 8
        canvas.height = 8
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve('rgb(13,20,55)')
          return
        }

        ctx.drawImage(img, 0, 0, 8, 8)
        const { data } = ctx.getImageData(0, 0, 8, 8)

        let r = 0, g = 0, b = 0
        const pixelCount = data.length / 4

        for (let i = 0; i < data.length; i += 4) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
        }

        r = Math.round(r / pixelCount)
        g = Math.round(g / pixelCount)
        b = Math.round(b / pixelCount)

        // 다크 tint 적용 (다크 글래스모피즘 카드 배경)
        const result = darkTintColor(r, g, b, 0.82)
        colorCache.set(imageUrl, result)
        resolve(result)
      } catch {
        resolve('rgb(13,20,55)')
      }
    }

    img.onerror = () => resolve('rgb(13,20,55)')
    img.src = imageUrl
  })
}

// 라이트 테마용: 앨범 색상을 흰색(245,248,255)에 혼합해 파스텔 배경 생성
// amount=0.72 → 72% 흰색 + 28% 앨범 색상
function lightTintColor(r: number, g: number, b: number, amount = 0.72): string {
  const base = { r: 245, g: 248, b: 255 } // near-white blue tint
  const lr = Math.round(base.r + (r - base.r) * (1 - amount))
  const lg = Math.round(base.g + (g - base.g) * (1 - amount))
  const lb = Math.round(base.b + (b - base.b) * (1 - amount))
  return `rgb(${lr},${lg},${lb})`
}

// 이미지 URL에서 라이트 파스텔 배경색 추출 (ArtistPage 배경용)
// 반환: [밝은 색1, 밝은 색2] — CSS gradient에 사용
export async function extractAlbumColorLight(imageUrl: string): Promise<[string, string]> {
  if (!imageUrl) return ['rgb(240,246,255)', 'rgb(237,233,255)']

  const cacheKey = imageUrl + '__light'
  const cached = colorCache.get(cacheKey) as string | undefined
  if (cached) {
    const parts = cached.split('|')
    return [parts[0], parts[1]]
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 8
        canvas.height = 8
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(['rgb(240,246,255)', 'rgb(237,233,255)']); return }

        ctx.drawImage(img, 0, 0, 8, 8)
        const { data } = ctx.getImageData(0, 0, 8, 8)

        let r = 0, g = 0, b = 0
        const pixelCount = data.length / 4
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]; g += data[i + 1]; b += data[i + 2]
        }
        r = Math.round(r / pixelCount)
        g = Math.round(g / pixelCount)
        b = Math.round(b / pixelCount)

        const c1 = lightTintColor(r, g, b, 0.7)   // 더 밝은 톤
        const c2 = lightTintColor(r, g, b, 0.55)  // 살짝 더 진한 톤
        colorCache.set(cacheKey, `${c1}|${c2}`)
        resolve([c1, c2])
      } catch {
        resolve(['rgb(240,246,255)', 'rgb(237,233,255)'])
      }
    }

    img.onerror = () => resolve(['rgb(240,246,255)', 'rgb(237,233,255)'])
    img.src = imageUrl
  })
}

// THREE.js Color 인스턴스용 RGB 추출 (0~1 범위)
export async function extractAlbumColorRGB(
  imageUrl: string
): Promise<{ r: number; g: number; b: number }> {
  const cssColor = await extractAlbumColor(imageUrl)
  const match = cssColor.match(/rgb\((\d+),(\d+),(\d+)\)/)
  if (!match) return { r: 0.051, g: 0.078, b: 0.216 } // #0d1437
  return {
    r: parseInt(match[1]) / 255,
    g: parseInt(match[2]) / 255,
    b: parseInt(match[3]) / 255,
  }
}
