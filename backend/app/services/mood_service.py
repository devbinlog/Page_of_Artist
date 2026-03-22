from app.models.audio_features import AudioFeatures
from app.schemas.mood import MoodSchema


def derive_mood_tag(energy: float, valence: float) -> str:
    """
    Spotify Audio Features 수치에서 mood 태그를 파생.
    DB 저장 없이 런타임에 계산.

    에너지/감성 매트릭스:
                  valence 낮음    valence 높음
    energy 높음   aggressive     euphoric
    energy 중간   intense        upbeat
    energy 낮음   melancholic    dreamy
    """
    if energy >= 0.7 and valence >= 0.6:
        return "euphoric"
    if energy >= 0.7 and valence < 0.4:
        return "aggressive"
    if energy >= 0.7:
        return "upbeat"
    if energy >= 0.5 and valence >= 0.5:
        return "upbeat"
    if energy >= 0.5 and valence < 0.5:
        return "intense"
    if energy < 0.4 and valence >= 0.6:
        return "dreamy"
    if energy < 0.4 and valence < 0.4:
        return "melancholic"
    return "balanced"


def build_mood_schema(features: AudioFeatures) -> MoodSchema:
    """AudioFeatures ORM 모델 → MoodSchema 변환"""
    return MoodSchema(
        tag=derive_mood_tag(features.energy, features.valence),
        energy=features.energy,
        valence=features.valence,
        tempo=features.tempo,
        danceability=features.danceability,
    )


def build_default_mood() -> MoodSchema:
    """Audio Features 데이터 없을 때 사용하는 기본 mood"""
    return MoodSchema(
        tag="balanced",
        energy=0.5,
        valence=0.5,
        tempo=120.0,
        danceability=0.5,
    )
