// Spotify Client Credentials 토큰 캐시
// expires_in(3600초) 기준으로 만료 60초 전 갱신

import type { SpotifyTokenResponse } from '../types/spotify'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

let cachedToken: string | null = null
let tokenExpiresAt = 0

export async function getSpotifyToken(): Promise<string> {
  const now = Date.now()

  // 만료 60초 전까지는 캐시 사용
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Spotify token request failed: ${response.status} ${text}`)
  }

  const data = (await response.json()) as SpotifyTokenResponse
  cachedToken = data.access_token
  tokenExpiresAt = now + data.expires_in * 1000

  return cachedToken
}
