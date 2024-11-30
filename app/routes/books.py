from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import Table, MetaData, select, desc
from ..database.connection import get_db, engine_url
from ..models.books import Books  # Assuming Book is a SQLModel class
from ..models.libraries import Libraries
from ..models.reviews import Reviews
from ..models.users import Users
from ..models.booklibraries import BookLibraries
from ..schemas.books import BookResponse, LibraryOwnerResponse
from ..schemas.reviews import ReviewShorts

from typing import List

# Initialize metadata and bookstatistics table for querying
metadata = MetaData()
bookstatistics = Table('bookstatistics', metadata, autoload_with=engine_url)
books_table = Table('books', metadata, autoload_with=engine_url)  # Ensure you load the books table this way

# Define the router for books-related endpoints
book_router = APIRouter(prefix='/books', tags=["Books"])

@book_router.get('/top', response_model=List[BookResponse])
async def get_top_books(criteria: str = Query("highest_rating", description="Sorting criteria: 'highest_rating', 'title', 'number_of_reviews', 'publication_year'"),
    limit: int = Query(10, ge=1, le=100, description="Number of results to return (1-100)"), db: Session = Depends(get_db)):
    # Handle sorting based on the criteria argument
    if criteria == 'highest_rating':
        books_query = db.execute(
            select(bookstatistics, books_table).join(books_table, books_table.c.isbn == bookstatistics.c.isbn).order_by(desc(bookstatistics.c.average_rating)).limit(limit)
        ).fetchall()
    elif criteria == 'title':
        books_query = db.execute(
            select(bookstatistics, books_table).join(books_table, books_table.c.isbn == bookstatistics.c.isbn).order_by(books_table.c.book_title).limit(limit)
        ).fetchall()
    elif criteria == 'number_of_reviews':
        books_query = db.execute(
            select(bookstatistics, books_table).join(books_table, books_table.c.isbn == bookstatistics.c.isbn).order_by(desc(bookstatistics.c.total_reviews)).limit(limit)
        ).fetchall()
    elif criteria == 'publication_year':
        books_query = db.execute(
            select(bookstatistics, books_table).join(books_table, books_table.c.isbn == bookstatistics.c.isbn).order_by(desc(books_table.c.publication_year)).limit(limit)
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
async def search_books(book_title: str = "", sort_by: str = Query("name", enum=["name", "number of reviews", "rating", "publication year"]), db: Session = Depends(get_db)):
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

@book_router.get('/{isbn}', response_model=BookResponse)
async def get_book_by_isbn(isbn: str, db: Session = Depends(get_db)):
    # Query to get the book by ISBN
    book = db.execute(
        select(Books).filter(Books.isbn == isbn)
    ).scalar_one_or_none()

    # If the book is not found, raise a 404 error
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Calculate the total reviews and average rating
    total_reviews = len(book.reviews)
    average_rating = sum(review.rating for review in book.reviews) / total_reviews if total_reviews else 0

    # Return the book details in the BookResponse format
    return BookResponse(
        isbn=book.isbn,
        book_title=book.book_title,
        author=book.author,
        publisher=book.publisher,
        publication_year=book.publication_year,
        genre=book.genre,
        cover_image=book.cover_image,
        average_rating=average_rating,
        total_reviews=total_reviews
    )

@book_router.get('/{isbn}/own_libraries', response_model=List[LibraryOwnerResponse])
async def own_libraries(isbn: str, db: Session = Depends(get_db)):
    # Query to get all the libraries that own the book with the provided ISBN
    own_libraries = db.execute(
        select(Libraries.library_id, Libraries.library_name, Libraries.address, Libraries.homepage)
        .join(BookLibraries, BookLibraries.library_id == Libraries.library_id)
        .filter(BookLibraries.isbn == isbn)
    ).all()
    # If no libraries are found, return an empty list
    if not own_libraries:
        return []  # Return an empty list instead of raising a 404 error
    # Return a list of libraries with their ID and name
    return [LibraryOwnerResponse(library_id=library_id, library_name=library_name, address=address, homepage=homepage) for library_id, library_name, address, homepage in own_libraries]

# @book_router.get('/{isbn}/own_libraries', response_model=List[LibraryOwnerResponse])
# async def own_libraries(isbn: str, db: Session = Depends(get_db)):
#     print("-------------------------------------------")
#     print(isbn)
#     print("-------------------------------------------")

#     # Query to get all the libraries that own the book with the provided ISBN
#     own_libraries = db.execute(
#         select(Libraries.library_id, Libraries.library_name)
#         .join(BookLibraries, BookLibraries.library_id == Libraries.library_id)
#         .filter(BookLibraries.isbn == isbn)
#     ).all()

#     # If no libraries are found, raise a 404 error
#     if not own_libraries:
#         raise HTTPException(status_code=404, detail="No libraries found that own the book")

#     # Return a list of libraries with their ID and name
#     return [LibraryOwnerResponse(library_id=library_id, library_name=library_name) for library_id, library_name in own_libraries]

@book_router.get('/{isbn}/reviews', response_model=List[ReviewShorts])
async def get_reviews_by_isbn(isbn: str, db: Session = Depends(get_db)):
    # Query to get all reviews for the given ISBN, along with associated user and book author details
    reviews = db.execute(
        select(Reviews, Books.book_title, Users.nickname)
        .join(Books, Reviews.isbn == Books.isbn)
        .join(Users, Reviews.user_id == Users.user_id)
        .filter(Reviews.isbn == isbn)
    ).all()

    # If no reviews are found for the given ISBN, raise a 404 error
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for the given ISBN")
    print(reviews)
    # Return the list of reviews with the required details using the ReviewShorts schema
    return [
        ReviewShorts(
            isbn=review[0].isbn,
            user_id=review[0].user_id,
            review_title=review[0].review_title,
            body=review[0].body,
            rating=review[0].rating,
            likes=review[0].likes,
            created_at=review[0].created_at,
            book_title=review[1],
            nickname=review[2]
        )
        for review in reviews
    ]