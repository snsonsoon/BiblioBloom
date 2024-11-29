from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from ..database.connection import get_db, engine_url
from ..models.libraries import Libraries
from ..models.books import Books
from ..models.statistics import BookStatistics
from ..models.booklibraries import BookLibraries
from ..schemas.libraries import LibraryResponse
from ..schemas.books import BookResponse
from typing import List

library_router = APIRouter(prefix='/libraries', tags=["Libraries"])

@library_router.get('/search', response_model=List[LibraryResponse])
async def search_libraries(library_name: str, db: Session = Depends(get_db)):
    # Query to find libraries where the library_name contains the given word (case-insensitive)
    matched_libraries = db.execute(
        select(Libraries)
        .filter(Libraries.library_name.ilike(f"%{library_name}%"))
    ).scalars().all()

    print(matched_libraries)

    # If no libraries are found, raise a 404 error
    if not matched_libraries:
        raise HTTPException(status_code=404, detail="No libraries found with the given name")

    # Return the list of libraries that match the search
    return [LibraryResponse(
        library_id=library.library_id,
        library_name=library.library_name,
        address=library.address,
        homepage=library.homepage
    ) for library in matched_libraries]

@library_router.get('/{library_id}', response_model=LibraryResponse)
async def get_library_by_id(library_id: int, db: Session = Depends(get_db)):
    # Query to get the library by library_id
    library = db.execute(
        select(Libraries).filter(Libraries.library_id == library_id)
    ).scalar_one_or_none()

    # If the library is not found, raise a 404 error
    if not library:
        raise HTTPException(status_code=404, detail="Library not found")

    # Return the library details in the LibraryResponse format
    return LibraryResponse(
        library_id=library.library_id,
        library_name=library.library_name,
        address=library.address,
        homepage=library.homepage
    )

@library_router.get('/{library_id}/books', response_model=List[BookResponse])
async def get_books_by_library(library_id: int, db: Session = Depends(get_db)):
    # Query to get books in the specified library, ordered by average_rating
    books = db.execute(
        select(Books, BookStatistics.average_rating, BookStatistics.total_reviews)
        .join(BookLibraries, BookLibraries.isbn == Books.isbn)
        .join(BookStatistics, BookStatistics.isbn == Books.isbn)  # Directly access BookStatistics attributes
        .filter(BookLibraries.library_id == library_id)
        .order_by(BookStatistics.average_rating.desc())  # Directly access BookStatistics attributes
    ).all()

    # If no books are found for the given library_id, raise a 404 error
    if not books:
        raise HTTPException(status_code=404, detail="No books found for the given library")

    # Return the list of books in the desired format
    return [
        BookResponse(
            isbn=book[0].isbn,
            book_title=book[0].book_title,
            author=book[0].author,
            publisher=book[0].publisher,
            publication_year=book[0].publication_year,
            genre=book[0].genre,
            cover_image=book[0].cover_image,
            average_rating=book[1],  # average rating from BookStatistics
            total_reviews=book[2]    # total reviews from BookStatistics
        )
        for book in books
    ]