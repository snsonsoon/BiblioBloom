from pydantic import BaseModel
from sqlmodel import Field
from datetime import datetime
from typing import Optional

class ReviewKey(BaseModel):
    isbn: str 
    user_id: str 

class ReviewUpdateRequest(BaseModel):
    review_title: str
    body: str
    rating: int = Field(default=0, ge=0, le=5)

class AddReviewRequest(BaseModel): 
    isbn: str 
    user_id: str 
    review_title: str 
    body: str 
    rating: int

class ReviewShorts(BaseModel):
    isbn: str
    user_id: str
    review_title: str
    body: str
    rating: int
    likes: int
    created_at: datetime
    book_title: str
    nickname: str

class ReviewDetails(BaseModel):
    isbn: str
    user_id: str

    review_title: str
    body: str
    rating: int
    likes: int
    created_at: datetime
    
    book_title: str
    author: str
    publisher: str
    publication_year: int
    genre: str
    cover_image: str

    nickname: str
    