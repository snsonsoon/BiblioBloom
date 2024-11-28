import React from "react";
import { Link } from "react-router-dom";

const RecommendedBooks = () => {
  // Mock 데이터
  const recommendedBooks = [
    { id: 1, title: "책 제목1", image: "/book1.png" },
    { id: 2, title: "책 제목2", image: "/book2.png" },
    { id: 3, title: "책 제목3", image: "/book3.png" },
    { id: 4, title: "책 제목4", image: "/book4.png" },
    { id: 5, title: "책 제목5", image: "/book5.png" },
  ];

  return (
    <div className="main-page-container">
      <h1 className="statistics-title">이달의 권장 도서</h1>
    <div className="recommended-books-container">
      <div className="book-list">
        {recommendedBooks.map((book) => (
          <div key={book.id} className="book-item">
            <img src={book.image} alt={book.title} />
            <p>
              <Link to={`/books/${book.id}`}>{book.title}</Link>
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default RecommendedBooks;