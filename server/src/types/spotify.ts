// Spotify Web API 응답 타입 정의

export interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface SpotifyImage {
  url: string
  height: number | null
  width: number | null
}

export interface SpotifyArtistRaw {
  id: string
  name: string
  images: SpotifyImage[]
  genres: string[]
  popularity: number
  external_urls: {
    spotify: string
  }
  followers: {
    total: number
  }
}

export interface SpotifyAlbumSimple {
  id: string
  name: string
  images: SpotifyImage[]
  release_date: string
  total_tracks: number
  album_type: string
  external_urls: {
    spotify: string
  }
}

export interface SpotifyTrackSimple {
  id: string
  name: string
  track_number: number
  duration_ms: number
  external_urls: {
    spotify: string
  }
  preview_url: string | null
}

export interface SpotifyAlbumDetail extends SpotifyAlbumSimple {
  tracks: {
    items: SpotifyTrackSimple[]
    total: number
  }
}

export interface SpotifySearchResult {
  artists: {
    items: SpotifyArtistRaw[]
    total: number
    limit: number
    offset: number
  }
}

export interface SpotifyArtistAlbumsResult {
  items: SpotifyAlbumSimple[]
  total: number
}
