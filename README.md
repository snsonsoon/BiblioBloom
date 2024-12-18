# <img src="frontend/src/assets/logo-small.png" width="30" height="30"/> BiblioBloom

데이터 베이스 3분반 6조 2022113138 정승원, 2022113179 정지우

Bibliobloom은 독서를 기록하고 공유하며, 독서 문화를 풍요롭게 하는 것을 목표로 한 **도서 커뮤니티 플랫폼**입니다.  
**"Reading, Reviewing, and Relating"** 을 통해 책(Biblio)을 통해 독서 습관과 지식을 꽃피움(Bloom)으로써,<br>현대인의 **독서량 감소와 문해력 저하 문제**를 해결하고자 합니다.

---

## 🚀 **기술 스택**

| **분류**         | **기술 스택**         |
|-------------------|-----------------------|
| 📂 데이터베이스   | MySQL                |
| 🖥️ 백엔드         | FastAPI              |
| 💻 프론트엔드     | React                |


## 👥 **역할 분담**

| **이름**           | **담당 업무**                                                                                       |
|--------------------|----------------------------------------------------------------------------------------------------|
| 🛠️ **정승원**     | 📋 프로젝트 기획 및 설계<br>🗄️ 데이터베이스 설계 및 구축<br>🔗 API 설계 및 연동<br>🖥️ 백엔드 개발<br>📢 발표 및 발표 자료 제작 |
| 🎨 **정지우**     | 📋 프로젝트 기획 및 설계<br>🗄️ 데이터베이스 설계 전반<br>🔗 API 연동<br>🎨 UI/UX 디자인<br>💻 프론트엔드 개발<br>📝 프로젝트 문서화 및 보고서 작성 |


---

## ☑️ 요구 사항
이 프로젝트를 실행하기 전에 다음 소프트웨어가 설치되어 있어야 합니다:
- **Python 3.10**
- **Anaconda**
- **Node.js 22.11.0** (Node.js 설치시 컴퓨터 재부팅 필요할 수 있음)
- **React 18.3.1**
- **MySQL 8.0.37**
- **npm** 또는 **yarn** (Node.js 설치 시 포함)

---

## 🐿️ 설치

**리포지토리 클론하기**
   ```bash
   git clone https://github.com/snsonsoon/BiblioBloom.git
   cd BiblioBloom
```

## 백엔드 설정 (FastAPI)

### 1. 가상 환경 설정
먼저 conda 가상 환경을 생성하고 활성화합니다.

```bash
conda create -n BiblioBloom python=3.10
conda activate BiblioBloom
```

### 2. 필요한 라이브러리 설치
`requirements.txt` 파일에 나열된 라이브러리를 설치합니다.

```
pip install -r requirements.txt
```


## 프론트엔드 설정 (React)

### 1. 프로젝트 디렉토리로 이동
React 프로젝트 디렉토리로 이동합니다.
```bash
cd frontend
```

### 2. npm 패키지 설치
다음 명령어를 실행하여 필요한 npm 패키지를 설치합니다.
```bash
npm install
```
---

## 🗄️ 데이터베이스 설정 (MySQL)
### 1. 데이터베이스 생성
**MySQL에 접속한 뒤** 데이터베이스를 생성합니다.
```sql
CREATE DATABASE bibliobloom;
```

### 2. 환경 변수 설정
FastAPI 백엔드에서 데이터베이스 연결을 위해 **.env 파일에 변수값을 자신 MySQL 설정**의 맞게 수정합니다:
```env
MYSQL_USERNAME = your_username
MYSQL_PASSWORD = your_password
MYSQL_HOST = localhost
MYSQL_PORT = your_port
MYSQL_DB_NAME = bibliobloom
```

### 3. 테이블 생성
데이터 베이스가 배포되지 않아, 코드의 맞는 테이블을 생성해야합니다. **MySQL에 접속하여** 아래를 실행하세요:
```sql
CREATE TABLE Users (
	user_id VARCHAR(50) PRIMARY KEY UNIQUE,
	password VARCHAR(255) NOT NULL,
	nickname VARCHAR(50) NOT NULL
);
```

```sql
CREATE TABLE Books (
    isbn CHAR(13) PRIMARY KEY,
    book_title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    publication_year INT NOT NULL,
    genre VARCHAR(50),
    cover_image VARCHAR(255)
);
```

```sql
CREATE TABLE Libraries (
    library_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    library_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    homepage VARCHAR(255)
);
```

```sql
CREATE TABLE Reviews (
    isbn CHAR(13),
    user_id VARCHAR(50),
    review_title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    likes INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (isbn, user_id),
    FOREIGN KEY (isbn) REFERENCES Books(isbn) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
```

```sql
CREATE TABLE BookLibraries (
    isbn CHAR(13),
    library_id INT,
    availability BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (isbn, library_id),
    FOREIGN KEY (isbn) REFERENCES Books(isbn),
    FOREIGN KEY (library_id) REFERENCES Libraries(library_id)
);
```

```sql
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
```

```sql
CREATE VIEW UserStatistics AS
SELECT
	Users.user_id,
	COALESCE(AVG(Reviews.rating), 0) AS average_rating,  -- If AVG is NULL, return 0
	COUNT(Reviews.user_id) AS total_reviews
FROM
	Users
LEFT JOIN Reviews ON Users.user_id = Reviews.user_id
GROUP BY
	Users.user_id;
```

```sql
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
```
---

## ▶️ 실행 방법
### 백엔드 실행

1. **BiblioBloom 폴더에서** FastAPI 서버를 실행합니다.
```bash
uvicorn app.main:app --reload
```
2. 서버는 기본적으로 `http://127.0.0.1:8000`에서 실행됩니다.
   
### 프론트엔드 실행
1. React 개발 서버를 실행합니다.
```bash
cd frontend
npm start
```
2. 애플리케이션은 기본적으로 http://localhost:3000에서 실행됩니다.
---


## 📝 더미 데이터 삽입
다음은 기능확인을 위한 더미데이터 삽입 SQL문입니다.

**순서대로 실행하세요**
```sql
INSERT INTO users (user_id, password, nickname) VALUES
('user1', '$2b$12$xbqZgQcMPsK5QtyVrFIKfePv4XEOAtNGE1CkQQjQzB8biYBFhYBva', 'JohnDoe'),
('user2', '$2b$12$JlWZft2fksnqKspK62WIIeofVvAz8Q5qCHK7SnmQQ5kgnNTv6kCJW', 'JaneSmith'),
('user3', '$2b$12$fTIcBq4a/XvgZIGSpvW9h.O93MP4t7Uy3FWB1VC5ThxDmG.ys/6/i', 'AliceJohnson'),
('user4', '$2b$12$wvAz.C3bdBSykrzXbt6JN.Pe2C5RdOvK/JuX7VOfmGf8D/NVz169S', 'BobBrown'),
('user5', '$2b$12$9WvT8xrUPZ3Nx8H9qGUznuU9A6mGr21tQZzM9VlHDY4krCAGAMZSu', 'CharlieDavis'),
('user6', '$2b$12$zSQsScMOgr3JiojD46o.ye5advP2d16.9kxMuCh9M5fNZP1TI4Wvi', 'nickname6'),
('user7', '$2b$12$aFF4huM6Zl8.GVSrAKi9.Owp5vQLq.AIIDD64m5J2WFl2srPRdT/i', 'nickname7');
```
```sql
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
```
```sql
INSERT INTO Libraries (library_name, address, homepage) VALUES
('Harvard University Library', 'Cambridge, MA 02138, USA', 'https://library.harvard.edu/'),
('Dongguk University Library', '30 Pildong-ro, Jung-gu, Seoul, Korea', 'https://lib.dongguk.edu/'),
('Seoul National University Library', '1 Gwanak-ro, Gwanak-gu, Seoul, Korea', 'https://lib.snu.ac.kr/'),
('Stanford University Libraries', '450 Serra Mall, Stanford, CA 94305, USA', 'https://library.stanford.edu/'),
('KAIST Library', '291 Daehak-ro, Yuseong-gu, Daejeon, Korea', 'https://library.kaist.ac.kr/main.do'),
('MIT Libraries', '77 Massachusetts Ave, Cambridge, MA 02139, USA', 'https://libraries.mit.edu/');
```
```sql
INSERT INTO reviews (isbn, user_id, review_title, body, rating, likes, created_at) VALUES
	('9780312541538', 'user2', 'A Journey Through Time', 'An excellent read that takes you on an unforgettable adventure through history.', 5, 11, '2024-11-30 20:23:05'),
	('9780312541538', 'user3', 'An Epic Adventure', 'A thrilling and adventurous read that kept me on the edge of my seat. Highly recommended!', 5, 10, '2024-11-30 20:23:04'),
	('9780312541538', 'user6', 'Exploration Awaits', 'A thrilling journey that keeps you hooked till the end. Highly recommend it!', 5, 10, '2024-11-30 20:23:03'),
	('9780312863555', 'user6', 'Beyond the Horizon', 'An incredible adventure story. One of the best I\'ve read in this genre.', 4, 8, '2024-11-30 20:23:02'),
	('9780321547810', 'user2', 'Exploration Beyond Earth', 'An inspiring read on space exploration and humanity’s potential. A must-read for dreamers!', 5, 13, '2024-11-30 20:22:59'),
	('9780321547810', 'user4', 'Cosmic Wonders', 'An inspiring read for anyone interested in space and exploration. A captivating tale!', 5, 7, '2024-11-30 20:22:58'),
	('9780321548893', 'user4', 'Digital Revolution', 'The book gave me valuable insights into the world of digital nomads and remote work.', 4, 5, '2024-11-30 20:22:56'),
	('9780375760396', 'user3', 'History Comes Alive', 'A captivating historical narrative that brings the past to life in a fascinating way. Loved it!', 4, 8, '2024-11-30 20:22:55'),
	('9780375760396', 'user7', 'Historic Tales', 'A great historical narrative that brings past events to life. Truly captivating.', 4, 9, '2024-11-30 20:22:54'),
	('9780375870658', 'user2', 'Psychology Insights', 'This book helped me understand human behavior in a way I had never imagined before.', 4, 10, '2024-11-30 20:22:53'),
	('9780375870795', 'user7', 'Psychology Unpacked', 'This book offered amazing insights into human behavior and the mind. Loved it!', 5, 6, '2024-11-30 20:22:52'),
	('9780394823573', 'user2', 'Strategic Mastery', 'A brilliant read for anyone looking to understand strategy and leadership better.', 5, 12, '2024-11-30 20:22:51'),
	('9780394823573', 'user3', 'Timeless Wisdom', 'A thought-provoking read that provides deep insights into strategy.', 5, 12, '2024-11-30 20:22:50'),
	('9780394823573', 'user5', 'A Strategic Masterpiece', 'A brilliant book for anyone interested in strategy and leadership.', 5, 13, '2024-11-30 20:22:49'),
	('9780452284234', 'user2', 'Mind Expansion', 'A fascinating book about human psychology. It completely changed how I think about life.', 4, 10, '2024-11-30 20:22:48'),
	('9780452298477', 'user2', 'The Power of Mind', 'A thought-provoking book on the power of positive thinking. It truly changed my outlook on life.', 4, 9, '2024-11-30 20:22:47'),
	('9780743273565', 'user1', 'Fascinating Sci-Fi', 'Loved the combination of science fiction and adventure. Highly recommended!', 3, 6, '2024-11-30 20:22:46'),
	('9780743273565', 'user4', 'Exciting and Intriguing', 'The Lost World had a fantastic mix of science fiction and adventure.', 4, 5, '2024-11-30 20:22:45'),
	('9781456732876', 'user2', 'Alien Encounters', 'An eye-opening exploration into the possibilities of alien civilizations and extraterrestrial life.', 5, 12, '2024-11-30 20:22:43'),
	('9781456732876', 'user3', 'Alien Civilizations', 'This book opened my eyes to the possibility of extraterrestrial intelligence. Amazing!', 4, 7, '2024-11-30 20:22:42'),
	('9781456732999', 'user3', 'Quantum Insights', 'Feynman’s approach to quantum mechanics is as clear as it is complex. Loved it!', 5, 11, '2024-11-30 20:22:40'),
	('9781566199094', 'user4', 'A Must-Read', 'This book helped me change my daily habits and routines for the better.', 1, 18, '2024-11-30 20:22:39'),
	('9781566199094', 'user5', 'Life-Changing Lessons', 'This book really helped me understand the power of habits and change my routine.', 5, 15, '2024-11-30 20:22:38'),
	('9781861978769', 'user2', 'Mystery Unraveled', 'The plot twists were amazing, a real page-turner!', 4, 8, '2024-11-30 20:22:37'),
	('9781861978769', 'user3', 'Great Mystery', 'A captivating mystery with unexpected twists and turns.', 4, 9, '2024-11-30 20:22:36'),
	('9783161484100', 'user1', 'Great Adventure!', 'I really enjoyed the book, the adventure was thrilling!', 5, 10, '2024-11-30 20:22:35'),
	('9783161484100', 'user2', 'Amazing Adventure!', 'The adventure was absolutely thrilling. Couldn\'t put the book down!', 2, 7, '2024-11-30 20:22:34');
```
```sql
INSERT INTO booklibraries (isbn, library_id, availability) VALUES
('9780312541538', 1, 1),
('9780312541538', 2, 1),
('9780312541538', 3, 1),
('9780394823573', 3, 0),
('9780743273565', 4, 1),
('9781566199094', 5, 1),
('9781861978769', 2, 1),
('9783161484100', 1, 1);
```
---

## ⚙️ 추가 사항
### 유저 생성
```sql
CREATE ROLE 'library_admin';
GRANT SELECT, INSERT, UPDATE, DELETE ON bibliobloom.booklibraries TO 'library_admin';
GRANT SELECT, INSERT, UPDATE, DELETE ON bibliobloom.books TO 'library_admin';
GRANT SELECT, INSERT, UPDATE, DELETE ON bibliobloom.libraries TO 'library_admin';
GRANT SELECT, INSERT, UPDATE, DELETE ON bibliobloom.reviews TO 'library_admin';
GRANT SELECT, INSERT, UPDATE, DELETE ON bibliobloom.users TO 'library_admin';
GRANT SELECT ON bibliobloom.bookstatistics TO 'library_admin';
GRANT SELECT ON bibliobloom.userreviewgenres TO 'library_admin';
GRANT SELECT ON bibliobloom.userstatistics TO 'library_admin';
FLUSH PRIVILEGES;
```
```sql
CREATE ROLE 'general_user';
GRANT SELECT, INSERT, UPDATE, DELETE ON bibliobloom.reviews TO 'general_user';
GRANT SELECT, INSERT, UPDATE, DELETE ON bibliobloom.users TO 'general_user';
GRANT SELECT ON bibliobloom.booklibraries TO 'general_user';
GRANT SELECT ON bibliobloom.books TO 'general_user';
GRANT SELECT ON bibliobloom.libraries TO 'general_user';
GRANT SELECT ON bibliobloom.bookstatistics TO 'general_user';
GRANT SELECT ON bibliobloom.userreviewgenres TO 'general_user';
GRANT SELECT ON bibliobloom.userstatistics TO 'general_user';
FLUSH PRIVILEGES;
```

---
## 📢 문제 해결
+ 설치 중 문제가 발생하면 각 패키지의 공식 문서를 참조하세요.
+ frontend 실행중 `'react-scripts'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는
배치 파일이 아닙니다.` <br/> 위와 같은 에러가 나온다면 다음을 실행하세요
```bash
cd frontend
rm -rf node_modules
npm install
```
+ shell을 재시작 해보세요.
+ 백엔드와 프론트엔드의 의존성이 충돌하지 않도록 주의하세요.
---


## 💾 추가 자료
+ [Our Figma](https://www.figma.com/design/e2GIgNavuptPV7cHlozt2R/DB-proj_Bibliobloom?node-id=2015-2&t=dAT8tnvvE83ukAaS-1)
+ [FastAPI 공식 문서](https://fastapi.tiangolo.com/ko/)
+ [React 공식 문서](https://react.dev/)
+ [MySQL 공식 문서](https://dev.mysql.com/doc/)
