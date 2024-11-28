from pydantic import BaseModel
from typing import Dict

class UserStatisticsResponse(BaseModel):
    user_id: str
    average_rating: float
    total_reviews: int
    percentile: float | None = None  # Optional if percentile isn't always needed


class GenreRatioResponse(BaseModel):
    user_id: str
    genre_ratio: Dict[str, float]

    class Config:
        orm_mode = True

class UserBooksRead(BaseModel):
    user_id: str
    books_read_count: int