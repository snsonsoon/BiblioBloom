from sqlmodel import SQLModel, Field
from typing import Optional

class BookStatistics(SQLModel, table=False):  # `table=False`로 설정하여 뷰로 사용
    isbn: str = Field(primary_key=True, max_length=13)
    average_rating: Optional[float] = Field(default=None)
    total_reviews: Optional[int] = Field(default=None)

class UserStatistics(SQLModel, table=False):  # `table=False`로 설정하여 뷰로 사용
    user_id: str = Field(primary_key=True, max_length=50)
    average_rating: Optional[float] = Field(default=None)
    total_reviews: Optional[int] = Field(default=None)

class UserReviewGenres(SQLModel, table=False):  # `table=False`로 설정하여 뷰로 사용
    user_id: str = Field(primary_key=True, max_length=50)
    genre: str = Field(primary_key=True, max_length=50)
    review_count: Optional[int] = Field(default=None)
