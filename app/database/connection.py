from dotenv import load_dotenv
import os
from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy import text

load_dotenv()

USERNAME = os.environ.get('MYSQL_USERNAME')
PASSWORD = os.environ.get('MYSQL_PASSWORD')
HOST = os.environ.get('MYSQL_HOST')
PORT = os.environ.get('MYSQL_PORT')
DB_NAME = os.environ.get('MYSQL_DB_NAME')

DB_URL = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}'


connect_args = {}
engine_url = create_engine(DB_URL, echo=True, connect_args=connect_args)

CREATE_BOOK_STATISTICS_VIEW = """
CREATE VIEW BookStatistics AS
SELECT
    Books.isbn,
    COALESCE(AVG(Reviews.rating), 0) AS average_rating,
    COUNT(Reviews.isbn) AS total_reviews
FROM
    Books
LEFT JOIN Reviews ON Books.isbn = Reviews.isbn
GROUP BY
    Books.isbn;
"""

CREATE_USER_STATISTICS_VIEW = """
CREATE VIEW UserStatistics AS
SELECT
    Users.user_id,
    COALESCE(AVG(Reviews.rating), 0) AS average_rating,
    COUNT(Reviews.user_id) AS total_reviews
FROM
    Users
LEFT JOIN Reviews ON Users.user_id = Reviews.user_id
GROUP BY
    Users.user_id;
"""

CREATE_USER_REVIEW_GENRES_VIEW = """
CREATE VIEW UserReviewGenres AS
SELECT
    Users.user_id,
    Books.genre,
    COUNT(Reviews.isbn) AS review_count
FROM
    Users
JOIN Reviews ON Users.user_id = Reviews.user_id
JOIN Books ON Reviews.isbn = Books.isbn
GROUP BY
    Users.user_id, Books.genre;
"""

def view_exists(connection, view_name: str) -> bool:
    """Check if a view already exists in the database."""
    result = connection.execute(text(f"SHOW TABLES LIKE '{view_name}'"))
    return result.fetchone() is not None

def create_views():
    with engine_url.connect() as connection:
        # Check if the views already exist before attempting to create them
        if not view_exists(connection, 'BookStatistics'):
            connection.execute(CREATE_BOOK_STATISTICS_VIEW)
        if not view_exists(connection, 'UserStatistics'):
            connection.execute(CREATE_USER_STATISTICS_VIEW)
        if not view_exists(connection, 'UserReviewGenres'):
            connection.execute(CREATE_USER_REVIEW_GENRES_VIEW)

def conn():
    SQLModel.metadata.create_all(engine_url)

def get_db():
    db = Session(engine_url)
    try:
        yield db
    finally:
        db.close()