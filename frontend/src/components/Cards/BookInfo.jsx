import React from "react";
import "./BookInfo.css"; // 스타일 파일 분리

const BookInfo = ({ book }) => {
  return (
    <div className="book-info-container">
      <h2>{book.title}</h2>
      <p><strong>저자:</strong> {book.author}</p>
      <p><strong>출판사:</strong> {book.publisher}</p>
      <p><strong>출간 연도:</strong> {book.year}</p>
      <p><strong>분류:</strong> {book.genre}</p>
      <p><strong>평균 평점:</strong> {book.averageRating} / 5</p>
      <p><strong>서평 수:</strong> {book.reviewsCount}</p>
    </div>
  );
};

export default BookInfo;