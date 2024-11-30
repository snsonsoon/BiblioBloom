from sqlmodel import Session
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from ..connection import get_db

# 'users' 테이블에 삽입할 쿼리
insert_users_query = """
INSERT INTO users (user_id, password, nickname) VALUES
('user1', '$2b$12$xbqZgQcMPsK5QtyVrFIKfePv4XEOAtNGE1CkQQjQzB8biYBFhYBva', 'JohnDoe'),
('user2', '$2b$12$JlWZft2fksnqKspK62WIIeofVvAz8Q5qCHK7SnmQQ5kgnNTv6kCJW', 'JaneSmith'),
('user3', '$2b$12$fTIcBq4a/XvgZIGSpvW9h.O93MP4t7Uy3FWB1VC5ThxDmG.ys/6/i', 'AliceJohnson'),
('user4', '$2b$12$wvAz.C3bdBSykrzXbt6JN.Pe2C5RdOvK/JuX7VOfmGf8D/NVz169S', 'BobBrown'),
('user5', '$2b$12$9WvT8xrUPZ3Nx8H9qGUznuU9A6mGr21tQZzM9VlHDY4krCAGAMZSu', 'CharlieDavis'),
('user6', '$2b$12$zSQsScMOgr3JiojD46o.ye5advP2d16.9kxMuCh9M5fNZP1TI4Wvi', 'nickname6'),
('user7', '$2b$12$aFF4huM6Zl8.GVSrAKi9.Owp5vQLq.AIIDD64m5J2WFl2srPRdT/i', 'nickname7');
"""


# 'books' 테이블에 삽입할 쿼리
insert_books_query = """
INSERT INTO books (isbn, book_title, author, publisher, publication_year, genre, cover_image) VALUES
('9780312541538', 'Future Worlds', 'Alice Johnson', 'SciFi Universe', 2021, 'Science Fiction', 'https://image.aladin.co.kr/product/23228/42/cover/0593121619_2.jpg'),
('9780312863555', 'Beyond the Horizon', 'Rick Martinez', 'New Age Publishers', 2017, 'Travel', 'https://image.aladin.co.kr/product/7260/63/cover/1160947112_2.jpg'),
('9780312874681', 'Explorer\'s Guide', 'Rick Martinez', 'New Age Publishers', 2017, 'Travel', 'https://image.aladin.co.kr/product/23957/82/cover/0358157145_2.jpg'),
('9780321547810', 'Cosmic Journeys', 'Alice Johnson', 'SciFi Universe', 2021, 'Science Fiction', 'https://image.aladin.co.kr/product/25051/98/cover/0571349374_2.jpg'),
('9780321548893', 'Digital Nomads', 'Emily Zhang', 'New Age Publishers', 2019, 'Travel', 'https://image.aladin.co.kr/product/25200/23/cover/f292633697_2.jpg'),
('9780375760396', 'The Last Crusade', 'Michael Thompson', 'Historic Tales', 2005, 'History', 'https://image.aladin.co.kr/product/26379/64/cover/f372738223_2.jpg'),
('9780375870658', 'Historic Wars', 'Michael Thompson', 'Historic Tales', 2005, 'History', 'https://image.aladin.co.kr/product/15268/64/cover/f062533926_1.jpg'),
('9780375870795', 'Psychological Tricks', 'Carl Jung', 'PsychoPress', 2016, 'Psychology', 'https://image.aladin.co.kr/product/26548/92/cover/k692738832_1.jpg'),
('9780394823573', 'The Art of War', 'Sun Tzu', 'Ancient Press', -500, 'Philosophy', 'https://image.aladin.co.kr/product/20412/20/cover/0525610189_2.jpg'),
('9780452284234', 'The Mind\'s Eye', 'Linda Bates', 'PsychoPress', 2013, 'Psychology', 'https://image.aladin.co.kr/product/1949/45/cover/1409366588_1.jpg'),
('9780452298477', 'Brain Games', 'Linda Bates', 'PsychoPress', 2013, 'Psychology', 'https://image.aladin.co.kr/product/19355/2/cover/3943330508_2.jpg'),
('9780743273565', 'The Lost World', 'Arthur Conan Doyle', 'Classic Books', 1912, 'Science Fiction', 'https://image.aladin.co.kr/product/26602/22/cover/k342739916_1.jpg'),
('9781426217781', 'Hidden Depths', 'Maria Rodriguez', 'Oceanic Press', 2015, 'Non-Fiction', 'https://image.aladin.co.kr/product/25037/90/cover/k532632924_1.jpg'),
('9781436256685', 'Stellar Conquest', 'Neil Ranger', 'SciFi Universe', 2023, 'Science Fiction', 'https://image.aladin.co.kr/product/25783/81/cover/k302736714_1.jpg'),
('9781436279134', 'Ocean Mysteries', 'Maria Rodriguez', 'Oceanic Press', 2015, 'Non-Fiction', 'https://image.aladin.co.kr/product/26545/49/cover/k532738830_1.jpg'),
('9781456732876', 'Alien Civilizations', 'H.G. Wells', 'SciFi Universe', 2022, 'Science Fiction', 'https://image.aladin.co.kr/product/26075/18/cover/k432737151_1.jpg'),
('9781456732999', 'Quantum Mechanics for Beginners', 'Richard Feynman', 'Academic Press', 2011, 'Science', 'https://image.aladin.co.kr/product/7251/83/cover/1164261614_2.jpg'),
('9781566199094', 'The Power of Habit', 'Charles Duhigg', 'Business Books', 2012, 'Self-Help', 'https://image.aladin.co.kr/product/7285/47/cover/1166830012_2.jpg'),
('9781861978769', 'The Mystery of Shadows', 'Jane Smith', 'Mystery House', 2018, 'Mystery', 'https://image.aladin.co.kr/product/7266/94/cover/1161754903_2.jpg'),
('9783161484100', 'The Great Adventure', 'John Doe', 'Adventure Press', 2020, 'Adventure', 'https://image.aladin.co.kr/product/7270/91/cover/1161291636_2.jpg');
"""


# 'libraries' 테이블에 삽입할 쿼리
insert_libraries_query = """
INSERT INTO Libraries (library_name, address, homepage) VALUES
('Harvard University Library', 'Cambridge, MA 02138, USA', 'https://library.harvard.edu/'),
('Dongguk University Library', '30 Pildong-ro, Jung-gu, Seoul, Korea', 'https://lib.dongguk.edu/'),
('Seoul National University Library', '1 Gwanak-ro, Gwanak-gu, Seoul, Korea', 'https://lib.snu.ac.kr/'),
('Stanford University Libraries', '450 Serra Mall, Stanford, CA 94305, USA', 'https://library.stanford.edu/'),
('KAIST Library', '291 Daehak-ro, Yuseong-gu, Daejeon, Korea', 'https://library.kaist.ac.kr/main.do'),
('MIT Libraries', '77 Massachusetts Ave, Cambridge, MA 02139, USA', 'https://libraries.mit.edu/');
"""

# 'booklibraries' 테이블에 삽입할 쿼리
insert_booklibraries_query = """
INSERT INTO booklibraries (isbn, library_id, availability) VALUES
('9780312541538', 1, 1),
('9780312541538', 2, 1),
('9780312541538', 3, 1),
('9780394823573', 3, 0),
('9780743273565', 4, 1),
('9781566199094', 5, 1),
('9781861978769', 2, 1),
('9783161484100', 1, 1);
"""

# 'reviews' 테이블에 삽입할 쿼리
insert_reviews_query = """
INSERT INTO Reviews (isbn, user_id, review_title, body, rating, likes, created_at)
VALUES
    ('9783161484100', 'user1', 'Great Adventure!', 'I really enjoyed the book, the adventure was thrilling!', 5, 10, '2024-11-27 10:00:00'),
    ('9781861978769', 'user2', 'Mystery Unraveled', 'The plot twists were amazing, a real page-turner!', 4, 8, '2024-11-26 15:30:00'),
    ('9780394823573', 'user3', 'Timeless Wisdom', 'A thought-provoking read that provides deep insights into strategy.', 5, 12, '2024-11-25 09:00:00'),
    ('9780743273565', 'user4', 'Exciting and Intriguing', 'The Lost World had a fantastic mix of science fiction and adventure.', 4, 5, '2024-11-24 14:45:00'),
    ('9781566199094', 'user5', 'Life-Changing Lessons', 'This book really helped me understand the power of habits and change my routine.', 5, 15, '2024-11-23 18:20:00'),
    ('9783161484100', 'user2', 'Amazing Adventure!', 'The adventure was absolutely thrilling. Couldn''t put the book down!', 2, 7, '2024-11-22 11:00:00'),
    ('9781861978769', 'user3', 'Great Mystery', 'A captivating mystery with unexpected twists and turns.', 4, 9, '2024-11-21 16:30:00'),
    ('9780394823573', 'user5', 'A Strategic Masterpiece', 'A brilliant book for anyone interested in strategy and leadership.', 5, 13, '2024-11-20 08:15:00'),
    ('9780743273565', 'user1', 'Fascinating Sci-Fi', 'Loved the combination of science fiction and adventure. Highly recommended!', 3, 6, '2024-11-19 12:00:00'),
    ('9781566199094', 'user4', 'A Must-Read', 'This book helped me change my daily habits and routines for the better.', 1, 18, '2024-11-18 14:45:00');
"""

def insert_if_empty(db: Session, table_name: str, insert_query: str):
    """테이블에 데이터가 없으면 INSERT 쿼리로 데이터를 삽입합니다."""
    # 테이블에 데이터가 있는지 확인
    check_query = f"SELECT COUNT(*) FROM {table_name};"
    result = db.execute(text(check_query)).fetchone()

    # 데이터가 없으면 삽입
    if result and result[0] == 0:
        try:
            # INSERT 쿼리 실행
            db.execute(text(insert_query))
            db.commit()
            return f"{table_name}에 새로운 데이터를 삽입했습니다."
        except IntegrityError:
            db.rollback()  # 오류 발생 시 롤백
            raise
    else:
        return f"{table_name}에는 이미 데이터가 있습니다."

def insert_if_emptys(db: Session = Depends(get_db)):
    insert_if_empty(db, 'books', insert_books_query)
    insert_if_empty(db, 'booklibraries', insert_booklibraries_query)
    insert_if_empty(db, 'libraries', insert_libraries_query)
    insert_if_empty(db, 'reviews', insert_reviews_query)
    insert_if_empty(db, 'users', insert_users_query)