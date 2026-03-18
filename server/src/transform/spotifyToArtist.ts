// Spotify API 응답 → Artist 타입 변환
// NOTE: Client Credentials로는 youtubeUrl / instagramUrl 수집 불가 → 빈 문자열

import type { SpotifyArtistRaw, SpotifyAlbumDetail, SpotifyTrackSimple } from '../types/spotify'

export interface Artist {
  id: string
  name: string
  imageUrl: string
  description: string
  genres: string[]
  spotifyUrl: string
  featuredAlbum: {
    id: string
    name: string
    imageUrl: string
    tracks: { number: number; name: string }[]
  }
  // 수동 입력 데이터 — API에서는 빈 문자열
  featuredTrack: {
    name: string
    youtubeUrl: string
  }
  albumYoutubeUrl: string
  instagramUrl: string
}

export function transformArtist(
  artist: SpotifyArtistRaw,
  album: SpotifyAlbumDetail
): Artist {
  // 이미지: 가장 큰 것 (index 0) 또는 fallback
  const artistImage = artist.images[0]?.url ?? ''
  const albumImage = album.images[0]?.url ?? ''

  // 트랙 목록 (최대 20개)
  const tracks = album.tracks.items.slice(0, 20).map((t: SpotifyTrackSimple) => ({
    number: t.track_number,
    name: t.name,
  }))

  // 대표곡: 첫 번째 트랙 이름
  const featuredTrackName = tracks[0]?.name ?? ''

  return {
    id: artist.id,
    name: artist.name,
    imageUrl: artistImage,
    description: '',
    genres: artist.genres.slice(0, 3),
    spotifyUrl: artist.external_urls.spotify,
    featuredAlbum: {
      id: album.id,
      name: album.name,
      imageUrl: albumImage,
      tracks,
    },
    // Client Credentials로는 외부 링크 수집 불가 → 빈 문자열
    featuredTrack: {
      name: featuredTrackName,
      youtubeUrl: '',
    },
    albumYoutubeUrl: '',
    instagramUrl: '',
  }
}
