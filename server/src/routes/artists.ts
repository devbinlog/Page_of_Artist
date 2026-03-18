// GET /api/artists       — 전체 아티스트 목록
// GET /api/artists/genres — 장르 목록

import { Router, Request, Response } from 'express'
import { getArtists, getGenres } from '../services/artistService'

const router = Router()

router.get('/genres', (_req: Request, res: Response) => {
  res.json(getGenres())
})

router.get('/', async (_req: Request, res: Response) => {
  try {
    const artists = await getArtists()
    res.json(artists)
  } catch (err) {
    console.error('[/api/artists]', err)
    res.status(500).json({ error: 'Failed to fetch artists' })
  }
})

export default router
