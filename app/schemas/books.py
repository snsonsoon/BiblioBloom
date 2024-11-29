from pydantic import BaseModel
from typing import List

class BookResponse(BaseModel):
    isbn: str
    book_title : str
    author: str
    publisher: str
    publication_year: int
    genre : str
    cover_image : str
    average_rating: float
    total_reviews: int

class LibraryOwnerResponse(BaseModel):
    library_id: int
    library_name: str

    class Config:
        orm_mode = True
