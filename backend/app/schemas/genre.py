from pydantic import BaseModel


class GenreItem(BaseModel):
    id: int
    name: str
    artist_count: int

    model_config = {"from_attributes": True}


class GenreListResponse(BaseModel):
    data: list[GenreItem]
