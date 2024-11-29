from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, ForeignKey, String

class Reviews(SQLModel, table=True):
    isbn: str = Field(
        sa_column=Column(String(13), ForeignKey("books.isbn", ondelete="CASCADE"), primary_key=True)
    )
    user_id: str = Field(
        sa_column=Column(String(50), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    )
    review_title: str = Field(nullable=False, max_length=255)
    body: str = Field(nullable=False)
    rating: Optional[int] = Field(default=None, ge=1, le=5)  # Rating between 1 and 5
    likes: int = Field(default=0)
    created_at: datetime = Field(default=datetime.utcnow)

    # Relationships
    books: "Books" = Relationship(back_populates="reviews")
    users: "Users" = Relationship(back_populates="reviews")
