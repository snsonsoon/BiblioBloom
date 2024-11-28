from pydantic import BaseModel

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