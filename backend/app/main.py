from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from datetime import datetime

from app.config import get_settings
from app.routers import artists, interactions

settings = get_settings()

# ── FastAPI 앱 ─────────────────────────────────────────────
app = FastAPI(
    title="Page of Artist API",
    description="3D 아티스트 탐색 플랫폼 백엔드 API",
    version="1.0.0",
    docs_url="/docs",       # Swagger UI
    redoc_url="/redoc",     # ReDoc
)

# ── Rate Limiter ───────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ───────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── 전역 에러 핸들러 ───────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
                "status": 500,
            }
        },
    )

# ── 라우터 등록 ────────────────────────────────────────────
app.include_router(artists.router, prefix="/api/v1")
app.include_router(interactions.router, prefix="/api/v1")

# ── 헬스 체크 ──────────────────────────────────────────────
@app.get("/api/v1/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
