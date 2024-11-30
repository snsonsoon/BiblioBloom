from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import SQLModel, Field, Session, create_engine, select
from ..database.connection import get_db
from ..models.reviews import Reviews 
from ..models.books import Books
from ..models.users import Users 
from ..schemas.reviews import ReviewShorts, ReviewDetails, AddReviewRequest, ReviewUpdateRequest
from typing import List
from datetime import datetime

review_router = APIRouter(prefix='/reviews', tags=["Review"])

@review_router.get('/sorted', response_model=List[ReviewShorts])
async def get_sorted_reviews(sort_by: str = Query("newest", enum=["newest", "likes"]), limit: int = Query(None, ge=1, description="Number of results to return (1-100)"), db: Session = Depends(get_db)):
    # Determine sorting order based on query parameter
    if sort_by == "newest":
        order_by = Reviews.created_at.desc()  # Newest first
    elif sort_by == "likes":
        order_by = Reviews.likes.desc()  # Most likes first
    else:
        raise HTTPException(status_code=400, detail="Invalid sort option")

    if limit is not None:
        # Query to fetch reviews sorted by the selected option
        sorted_reviews = db.exec(
            select(Reviews, Books.book_title, Users.nickname)
            .join(Books, Reviews.isbn == Books.isbn)
            .join(Users, Reviews.user_id == Users.user_id)
            .order_by(order_by).limit(limit)
        ).all()
    else:
        # Query to fetch reviews sorted by the selected option
        sorted_reviews = db.exec(
            select(Reviews, Books.book_title, Users.nickname)
            .join(Books, Reviews.isbn == Books.isbn)
            .join(Users, Reviews.user_id == Users.user_id)
            .order_by(order_by)
        ).all()

    if not sorted_reviews:
        raise HTTPException(status_code=404, detail="No reviews found")

    print(sorted_reviews)

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
        for review in sorted_reviews
    ]

@review_router.get('/details/{isbn}/{user_id}', response_model=ReviewDetails)
async def get_review_details(isbn: str, user_id: str, db: Session = Depends(get_db)):
    # Query to get the book and review based on ISBN and user_id
    print("-----------------------------------")
    print(isbn, user_id)
    print("-----------------------------------")

    result = db.execute(
        select(Books, Reviews, Users.nickname)
        .join(Reviews, Reviews.isbn == Books.isbn)
        .join(Users, Reviews.user_id == Users.user_id)
        .filter(Books.isbn == isbn, Reviews.user_id == user_id)
    ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="Book or review not found")

    book, review, nickname = result

    print(result)
    # Return book and review details using the ReviewDetails schema
    return ReviewDetails(
        isbn=review.isbn,
        user_id=review.user_id,
        review_title=review.review_title,
        body=review.body,
        rating=review.rating,
        likes=review.likes,
        created_at=review.created_at,
        book_title=book.book_title,
        author=book.author,
        publisher=book.publisher,
        publication_year=book.publication_year,
        genre=book.genre,
        cover_image=book.cover_image,
        nickname=nickname
    )

@review_router.post('/like/{isbn}/{user_id}', response_model=ReviewDetails)
async def increment_likes(isbn: str, user_id: str, db: Session = Depends(get_db)):
    # Query to get the review based on ISBN and user_id

    review = db.execute(
        select(Reviews).filter(Reviews.isbn == isbn, Reviews.user_id == user_id)
    ).scalar_one_or_none()

    # If the review does not exist, raise a 404 error
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    # Increment the likes count by 1
    review.likes += 1

    # Commit the changes to the database
    db.add(review)
    db.commit()

    # Refresh the review object to get the updated data
    db.refresh(review)

    # Return the updated review details
    return ReviewDetails(
        isbn=review.isbn,
        user_id=review.user_id,
        review_title=review.review_title,
        body=review.body,
        rating=review.rating,
        likes=review.likes,
        created_at=review.created_at,
        book_title=review.books.book_title,  # Assuming the relationship is set
        author=review.books.author,
        publisher=review.books.publisher,
        publication_year=review.books.publication_year,
        genre=review.books.genre,
        cover_image=review.books.cover_image,
        nickname=review.users.nickname  # Assuming the relationship is set
    )

@review_router.post('/add', response_model=ReviewDetails)
async def add_review(review_data: AddReviewRequest, db: Session = Depends(get_db)):
    """
    Add a new review for a book. Ensures that a review for the same book by the same user does not already exist.
    """
    # Unpack the request data
    isbn = review_data.isbn
    user_id = review_data.user_id
    review_title = review_data.review_title
    body = review_data.body
    rating = review_data.rating

    # Check if a review already exists for the given ISBN and user_id
    existing_review = db.exec(
        select(Reviews).where(Reviews.isbn == isbn, Reviews.user_id == user_id)
    ).first()

    if existing_review:
        raise HTTPException(status_code=400, detail="Review already exists for this user and book")

    # Create a new review entry
    new_review = Reviews(
        isbn=isbn,
        user_id=user_id,
        review_title=review_title,
        body=body,
        rating=rating,
        likes=0,  # Set initial likes to 0
        created_at=datetime.utcnow()  # Set the current time for created_at
    )

    # Add and commit the new review to the database
    db.add(new_review)
    db.commit()

    # Refresh the new review to get the updated data (including relationships)
    db.refresh(new_review)

    # Return the newly created review details
    return ReviewDetails(
        isbn=new_review.isbn,
        user_id=new_review.user_id,
        review_title=new_review.review_title,
        body=new_review.body,
        rating=new_review.rating,
        likes=new_review.likes,
        created_at=new_review.created_at,
        book_title=new_review.books.book_title,  # Assuming relationships are set
        author=new_review.books.author,
        publisher=new_review.books.publisher,
        publication_year=new_review.books.publication_year,
        genre=new_review.books.genre,
        cover_image=new_review.books.cover_image,
        nickname=new_review.users.nickname  # Assuming relationships are set
    )

@review_router.put('/update', response_model=ReviewDetails)
async def update_review(isbn: str, user_id: str, ReviewData: ReviewUpdateRequest,  db: Session = Depends(get_db)):
    review_title = ReviewData.review_title
    body = ReviewData.body
    rating = ReviewData.rating
    
    # Fetch the existing review
    review = db.execute(
        select(Reviews).filter(Reviews.isbn == isbn, Reviews.user_id == user_id)
    ).scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    # Update review fields
    review.review_title = review_title
    review.body = body
    review.rating = rating
    review.likes = 0
    # Save changes to the database
    db.add(review)
    db.commit()
    db.refresh(review)
    # Return updated review details
    return ReviewDetails(
        isbn=review.isbn,
        user_id=review.user_id,
        review_title=review.review_title,
        body=review.body,
        rating=review.rating,
        likes=review.likes,
        created_at=review.created_at,
        book_title=review.books.book_title,
        author=review.books.author,
        publisher=review.books.publisher,
        publication_year=review.books.publication_year,
        genre=review.books.genre,
        cover_image=review.books.cover_image,
        nickname=review.users.nickname
    )

@review_router.delete("/delete/{isbn}/{user_id}")
async def delete_review(isbn: str, user_id: str, db: Session = Depends(get_db)):
    db_review = db.query(Reviews).filter(Reviews.isbn == isbn, Reviews.user_id == user_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(db_review)
    db.commit()
    return {"message": f"Review for ISBN {isbn} by user {user_id} successfully deleted"}