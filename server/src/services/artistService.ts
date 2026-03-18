// 아티스트 서비스 레이어
// Spotify API 호출 + 정적 데이터 폴백 로직을 라우터에서 분리

import { spotifyGet } from '../spotify/client'
import { transformArtist } from '../transform/spotifyToArtist'
import { STATIC_ARTISTS } from '../data/staticArtists'
import type { Artist } from '../transform/spotifyToArtist'
import type {
  SpotifySearchResult,
  SpotifyArtistRaw,
  SpotifyArtistAlbumsResult,
  SpotifyAlbumDetail,
} from '../types/spotify'

// 10분 캐시
const CACHE_TTL_MS = 10 * 60 * 1000
let cache: { data: Artist[]; expiresAt: number } | null = null

const SEARCH_QUERIES = [
  'genre:indie',
  'genre:alternative',
  'genre:indie-pop',
  'genre:dream-pop',
]

export const hasSpotifyCredentials = () =>
  !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET)

/**
 * 아티스트 전체 목록 반환
 * Spotify 설정 시 API 데이터, 아니면 정적 데이터
 */
export async function getArtists(): Promise<Artist[]> {
  if (!hasSpotifyCredentials()) return STATIC_ARTISTS

  // 캐시 유효
  if (cache && Date.now() < cache.expiresAt) return cache.data

  const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)]
  const searchResult = await spotifyGet<SpotifySearchResult>(
    `/search?q=${encodeURIComponent(query)}&type=artist&limit=20&market=KR`
  )

  const artists = searchResult.artists.items.filter(
    (a) => a.images.length > 0 && a.genres.length > 0
  )

  const transformed = await Promise.all(
    artists.slice(0, 12).map(async (artist) => {
      try {
        const albumsResult = await spotifyGet<SpotifyArtistAlbumsResult>(
          `/artists/${artist.id}/albums?include_groups=album&limit=5&market=KR`
        )
        if (!albumsResult.items.length) return null
        const albumDetail = await spotifyGet<SpotifyAlbumDetail>(
          `/albums/${albumsResult.items[0].id}`
        )
        return transformArtist(artist, albumDetail)
      } catch {
        return null
      }
    })
  )

  const result = transformed.filter((a): a is Artist => a !== null)
  cache = { data: result, expiresAt: Date.now() + CACHE_TTL_MS }
  return result
}

/**
 * 단일 아티스트 상세 반환
 */
export async function getArtistById(id: string): Promise<Artist | null> {
  if (!hasSpotifyCredentials()) {
    return STATIC_ARTISTS.find((a) => a.id === id) ?? null
  }

  const [artist, albumsResult] = await Promise.all([
    spotifyGet<SpotifyArtistRaw>(`/artists/${id}`),
    spotifyGet<SpotifyArtistAlbumsResult>(
      `/artists/${id}/albums?include_groups=album&limit=5&market=KR`
    ),
  ])

  if (!albumsResult.items.length) return null

  const albumDetail = await spotifyGet<SpotifyAlbumDetail>(
    `/albums/${albumsResult.items[0].id}`
  )

  return transformArtist(artist, albumDetail)
}

/**
 * 정적 데이터 기준 장르 목록 반환 (중복 제거, 정렬)
 */
export function getGenres(): string[] {
  const all = STATIC_ARTISTS.flatMap((a) => a.genres)
  return [...new Set(all)].sort()
}
