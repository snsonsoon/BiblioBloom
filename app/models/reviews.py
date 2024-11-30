from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
from sqlalchemy import ForeignKeyConstraint

class Reviews(SQLModel, table=True):
    isbn: str = Field(primary_key=True, max_length=13, foreign_key="books.isbn")
    user_id: str = Field(primary_key=True, max_length=50, foreign_key="users.user_id")  # Removed primary_key=True
    review_title: str = Field(nullable=False, max_length=255)
    body: str = Field(nullable=False)
    rating: Optional[int] = Field(default=0, ge=0, le=5)  # Rating between 0 and 5
    likes: int = Field(default=0)
    created_at: datetime = Field(default=datetime.utcnow)

    # Relationships
    books: "Books" = Relationship(back_populates="reviews")
    users: "Users" = Relationship(back_populates="reviews")

    # Foreign Key constraints with ON DELETE CASCADE
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='CASCADE'),
        ForeignKeyConstraint(['isbn'], ['books.isbn'], ondelete='CASCADE')
    )