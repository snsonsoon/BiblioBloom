import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendedBooks } from "../services/api"; // API 함수 가져오기
const RecommendedBooks = () => {
  const [recommendedBooks, setRecommendedBooks] = useState([]); // 권장 도서 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        const response = await getRecommendedBooks(); // API 호출
        setRecommendedBooks(response); // 상태 업데이트
      } catch (err) {
        console.error("API 요청 중 오류:", err);
        setError("권장 도서를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 로딩 완료
      }
    };
    fetchRecommendedBooks();
  }, []);
  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="main-page-container">
      <h1 className="statistics-title">이달의 권장 도서</h1>
      <div className="recommended-books-container">
        <div className="book-list">
          {recommendedBooks.map((book) => (
            <div key={book.isbn} className="book-item">
              <img src={book.cover_image} alt={book.book_title} />
              <p>
                <Link to={`/books/${book.isbn}`}>{book.book_title}</Link>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default RecommendedBooks;