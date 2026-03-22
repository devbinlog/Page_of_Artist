from sqlalchemy.orm import Session
from app.repositories.log_repo import LogRepository
from app.schemas.interaction import InteractionCreate, InteractionResponse


class LogService:
    def __init__(self, db: Session):
        self.repo = LogRepository(db)

    def log_event(self, data: InteractionCreate) -> InteractionResponse:
        self.repo.create(data)
        return InteractionResponse(logged=True)
