// dev.mjs — Vite 개발 서버 래퍼
// ETIMEDOUT 같은 unhandled error가 Vite를 죽이지 않도록 처리
import { createServer } from 'vite'

// 파일/네트워크 read timeout → Vite가 죽지 않도록 무시
process.on('uncaughtException', (err) => {
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET' || err.code === 'EPIPE') {
    console.warn('[dev] stream/connection error (ignored):', err.code, err.message)
    return // Vite 계속 실행
  }
  console.error('[dev] fatal error:', err)
  process.exit(1)
})

const server = await createServer()
await server.listen()
server.printUrls()
