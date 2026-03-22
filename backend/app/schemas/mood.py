from pydantic import BaseModel, Field


class MoodSchema(BaseModel):
    """
    아티스트 Mood 수치 + 파생 태그.
    DB에는 수치만 저장 — tag는 서비스 레이어에서 런타임 계산.

    프론트엔드 매핑:
        energy       → MoodParticles 속도
        valence      → MoodParticles 색상 (차갑다/따뜻하다)
        tempo        → MoodParticles 밀도
        danceability → MoodParticles 흩어짐
    """

    tag: str = Field(description="파생 mood 태그 (dreamy / melancholic / euphoric ...)")
    energy: float = Field(ge=0.0, le=1.0)
    valence: float = Field(ge=0.0, le=1.0)
    tempo: float = Field(gt=0.0, description="BPM")
    danceability: float = Field(ge=0.0, le=1.0)

    model_config = {"from_attributes": True}
