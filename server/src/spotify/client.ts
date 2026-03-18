// Spotify Web API 요청 래퍼
// 토큰 자동 갱신 + 에러 핸들링

import { getSpotifyToken } from './auth'

const SPOTIFY_BASE = 'https://api.spotify.com/v1'

export async function spotifyGet<T>(path: string): Promise<T> {
  const token = await getSpotifyToken()

  const url = path.startsWith('http') ? path : `${SPOTIFY_BASE}${path}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Spotify API error ${response.status}: ${text}`)
  }

  return response.json() as Promise<T>
}
