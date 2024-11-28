from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import Table, MetaData, select, desc
from ..database.connection import get_db, engine_url
from ..models.books import Books  # Assuming Book is a SQLModel class
from ..schemas.books import BookResponse
from typing import List

# Initialize metadata and bookstatistics table for querying
metadata = MetaData()
bookstatistics = Table('bookstatistics', metadata, autoload_with=engine_url)
books_table = Table('books', metadata, autoload_with=engine_url)  # Ensure you load the books table this way

# Define the router for books-related endpoints
book_router = APIRouter(prefix='/books', tags=["Books"])

@book_router.get('/top', response_model=List[BookResponse])
async def get_top_books(criteria: str, db: Session = Depends(get_db)):
    # Handle sorting based on the criteria argument
    if criteria == 'highest_rating':
        books_query = db.execute(
            select(bookstatistics, books_table).join(books_table, books_table.c.isbn == bookstatistics.c.isbn).order_by(desc(bookstatistics.c.average_rating))
        ).fetchall()
    elif criteria == 'title':
        books_query = db.execute(
            select(bookstatistics, books_table).join(books_table, books_table.c.isbn == bookstatistics.c.isbn).order_by(books_table.c.book_title)
        ).fetchall()
    elif criteria == 'number_of_reviews':
        books_query = db.execute(
            select(bookstatistics, books_table).join(books_table, books_table.c.isbn == bookstatistics.c.isbn).order_by(desc(bookstatistics.c.total_reviews))
        ).fetchall()
    elif criteria == 'publication_year':
        books_query = db.execute(
            select(bookstatistics, books_table).join(books_table, books_table.c.isbn == bookstatistics.c.isbn).order_by(desc(books_table.c.publication_year))
        ).fetchall()
    else:
        raise HTTPException(status_code=400, detail="Invalid criteria. Use one of: 'highest_rating', 'title', 'number_of_reviews', 'publication_year'.")

    print(books_query)
    # Return the results in the specified format
    return [
        BookResponse(
            isbn=row[0], 
            book_title=row[4],  
            author=row[5], 
            publisher=row[6], 
            publication_year=row[7], 
            genre=row[8],
            cover_image=row[9],
            average_rating=float(row[1]),  
            total_reviews=row[2] 
        ) for row in books_query
    ]

@book_router.get('/search', response_model=List[BookResponse])
def search_books(book_title: str = "", sort_by: str = Query("name", enum=["name", "number of reviews", "rating", "publication year"]), db: Session = Depends(get_db)):
    # Filter books based on the book title (case-insensitive)
    if book_title == "":
        books_query = db.execute(select(Books)).scalars().all()
    else:
        books_query = db.execute(
            select(Books)
            .filter(Books.book_title.ilike(f"%{book_title}%"))
        ).scalars().all()

    if not books_query:
        raise HTTPException(status_code=404, detail="No books found with the given title")

    # Sorting logic based on sort_by parameter
    if sort_by == "name":
        sorted_books = sorted(books_query, key=lambda books: books.book_title)
    elif sort_by == "number of reviews":
        sorted_books = sorted(books_query, key=lambda books: len(books.reviews), reverse=True)
    elif sort_by == "rating":
        sorted_books = sorted(books_query, key=lambda books: sum(review.rating for review in books.reviews) / len(books.reviews) if books.reviews else 0, reverse=True)
    elif sort_by == "publication year":
        sorted_books = sorted(books_query, key=lambda books: books.publication_year, reverse=True)

    # Prepare the response with average rating and total reviews
    book_responses = []
    for books in sorted_books:
        total_reviews = len(books.reviews)
        average_rating = sum(review.rating for review in books.reviews) / total_reviews if total_reviews else 0

        book_responses.append(BookResponse(
            isbn=books.isbn,
            book_title=books.book_title,
            author=books.author,
            publisher=books.publisher,
            publication_year=books.publication_year,
            genre=books.genre,
            cover_image=books.cover_image,
            average_rating=average_rating,
            total_reviews=total_reviews
        ))

    return book_responses