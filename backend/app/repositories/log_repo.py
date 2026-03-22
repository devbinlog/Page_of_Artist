import uuid
from sqlalchemy.orm import Session
from app.models.interaction_log import InteractionLog
from app.schemas.interaction import InteractionCreate


class LogRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: InteractionCreate) -> InteractionLog:
        log = InteractionLog(
            session_id=data.session_id,
            event_type=data.event_type.value,
            artist_id=data.artist_id,
            metadata=data.metadata,
        )
        self.db.add(log)
        self.db.commit()
        return log
