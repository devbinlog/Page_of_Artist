// Page of Artist — Express 백엔드
// PORT 3001, CORS 허용 (Vite dev: 5173, build: any)

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import artistsRouter from './routes/artists'
import artistRouter from './routes/artist'

dotenv.config()

const app = express()
const PORT = parseInt(process.env.PORT ?? '3001', 10)

// CORS: Vite dev + 프로덕션
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', /\.vercel\.app$/],
    methods: ['GET'],
  })
)

app.use(express.json())

// 헬스 체크
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 라우터 등록
app.use('/api/artists', artistsRouter)
app.use('/api/artist', artistRouter)

// 알 수 없는 라우트
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`)
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.warn('[server] WARNING: Spotify credentials not set — API routes will fail')
    console.warn('[server] Copy server/.env.example to server/.env and fill in credentials')
  }
})
