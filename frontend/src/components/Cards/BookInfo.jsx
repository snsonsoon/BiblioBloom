// import React from "react";
// import "./BookInfo.css"; // 스타일 파일 분리

// const BookInfo = ({ book }) => {
//   return (
//     <div className="book-info-container">
//       <div className="book-info-content">
//         {/* 책 표지 */}
//         <img className="book-cover" src={book.coverImage} alt={`${book.title} 표지`} />
//         {/* 텍스트 정보 */}
//         <div className="book-details">
//           <h2>{book.title}</h2>
//           <p><strong>저자:</strong> {book.author}</p>
//           <p><strong>출판사:</strong> {book.publisher}</p>
//           <p><strong>출간 연도:</strong> {book.year}</p>
//           <p><strong>분류:</strong> {book.genre}</p>
//           <p><strong>평균 평점:</strong> {book.averageRating} ({book.reviewsCount})</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookInfo;

import React from "react";
import { Link } from "react-router-dom";
import "./BookInfo.css"; // 스타일 파일 분리

const BookInfo = ({ book, showLink = false }) => {
  return (
    <div className="book-info-container">
      <div className="book-info-content">
        {/* 책 표지 */}
        <img
          className="book-cover"
          src={book.cover_image || "https://via.placeholder.com/120"}
          alt={`${book.book_title} 표지`}
        />
        {/* 책 세부 정보 */}
        <div className="book-details">
          {showLink ? (
            <h2>
              <Link to={`/books/${book.isbn}`}>{book.book_title}</Link>
            </h2>
          ) : (
            <h2>{book.book_title}</h2>
          )}
          <p><strong>저자:</strong> {book.author}</p>
          <p><strong>출판사:</strong> {book.publisher}</p>
          <p><strong>출간 연도:</strong> {book.year}</p>
          <p><strong>분류:</strong> {book.genre}</p>
          <p>
            <strong>평점:</strong> {book.average_rating} ({book.total_reviews})
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookInfo;
