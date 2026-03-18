import { apiClient } from './apiClient'
import { STATIC_ARTISTS } from '@/data/staticArtists'
import type { Artist } from '@/types/artist'

// Fisher-Yates shuffle (deterministic seed)
function shuffle(arr: Artist[], seed = 42): Artist[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Fetch artists from API, falling back to static data if unavailable.
 * Returns shuffled array.
 */
export async function fetchArtists(): Promise<Artist[]> {
  try {
    const data = await apiClient.get<Artist[]>('/api/artists')
    if (Array.isArray(data) && data.length > 0) return data
    throw new Error('Empty API response')
  } catch {
    console.info('[artistService] API unavailable — using static data')
    return shuffle(STATIC_ARTISTS)
  }
}

export function searchArtists(artists: Artist[], query: string): Artist[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return artists.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.genres.some((g) => g.toLowerCase().includes(q))
  )
}
