// 아티스트 데이터 타입 정의

export interface Track {
  number: number
  name: string
}

export interface FeaturedAlbum {
  id: string
  name: string
  imageUrl: string
  tracks: Track[]
}

export interface FeaturedTrack {
  name: string
  youtubeUrl: string
}

export interface Artist {
  id: string
  name: string
  imageUrl: string
  description: string
  genres: string[]
  spotifyUrl: string
  instagramUrl: string
  featuredAlbum: FeaturedAlbum
  featuredTrack: FeaturedTrack
  albumYoutubeUrl: string
  approved?: boolean
  createdAt?: string
}

export type CardFace = 'front' | 'back'
