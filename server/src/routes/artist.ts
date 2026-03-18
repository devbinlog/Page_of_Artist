// GET /api/artist/:id — 단일 아티스트 상세

import { Router, Request, Response } from 'express'
import { getArtistById } from '../services/artistService'

const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const artist = await getArtistById(id)
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' })
    }
    return res.json(artist)
  } catch (err) {
    console.error(`[/api/artist/${id}]`, err)
    return res.status(500).json({ error: 'Failed to fetch artist' })
  }
})

export default router
