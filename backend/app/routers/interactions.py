from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.database import get_db
from app.services.log_service import LogService
from app.schemas.interaction import InteractionCreate, InteractionResponse

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/interactions", tags=["interactions"])


@router.post("", response_model=InteractionResponse, status_code=201)
@limiter.limit("60/minute")  # 어뷰징 방지: IP당 분당 60회
def log_interaction(
    request: Request,
    body: InteractionCreate,
    db: Session = Depends(get_db),
):
    """
    사용자 인터랙션 이벤트 기록.
    익명 세션 기반 — 로그인 불필요.

    이벤트 타입: card_view / card_click / card_flip /
                link_click / search_query / search_select /
                page_enter / page_exit
    """
    service = LogService(db)
    return service.log_event(body)
