import uuid
import re
from pydantic import BaseModel, Field, field_validator
from app.models.interaction_log import EventType

UUID_PATTERN = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
    re.IGNORECASE,
)


class InteractionCreate(BaseModel):
    """
    POST /api/v1/interactions 요청 바디.

    metadata 예시:
        card_flip    → {"from_face": "front", "to_face": "back"}
        link_click   → {"platform": "youtube"}
        page_exit    → {"duration_ms": 4200}
        search_query → {"query": "indie", "result_count": 5}
    """

    session_id: str = Field(..., description="프론트엔드 생성 UUID v4")
    event_type: EventType
    artist_id: uuid.UUID | None = None
    metadata: dict | None = None

    @field_validator("session_id")
    @classmethod
    def validate_session_id(cls, v: str) -> str:
        if not UUID_PATTERN.match(v):
            raise ValueError("session_id must be a valid UUID v4")
        return v

    @field_validator("metadata")
    @classmethod
    def validate_metadata_size(cls, v: dict | None) -> dict | None:
        if v is not None and len(str(v)) > 1024:
            raise ValueError("metadata must not exceed 1KB")
        return v


class InteractionResponse(BaseModel):
    logged: bool = True
