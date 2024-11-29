from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class BookStatistics(SQLModel, table=True):
    isbn: str = Field(primary_key=True, max_length=13, foreign_key="books.isbn")
    average_rating: float = Field(default=0.0)
    total_reviews: int = Field(default=0)
    
    books: "Books" = Relationship(back_populates="statistics")

class UserStatistics(SQLModel, table=True):
    user_id: str = Field(primary_key=True, max_length=50, foreign_key='Users.isbn')
    average_rating: Optional[float] = Field(default=0)
    total_reviews: Optional[int] = Field(default=0)

class UserReviewGenres(SQLModel, table=True): 
    user_id: str = Field(primary_key=True, max_length=50)
    genre: str = Field(primary_key=True, max_length=50)
    review_count: Optional[int] = Field(default=0)
