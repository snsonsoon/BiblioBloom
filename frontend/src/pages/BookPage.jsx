import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import BookInfo from "../components/Cards/BookInfo";
import "./Page.css";

const mockBooks = [
  {
    id: 1,
    title: "책 제목1",
    author: "작가1",
    publisher: "출판사1",
    year: 2022,
    genre: "문학",
    averageRating: 4.5,
    reviewsCount: 12,
  },
  {
    id: 2,
    title: "책 제목2",
    author: "작가2",
    publisher: "출판사2",
    year: 2021,
    genre: "경제",
    averageRating: 4.0,
    reviewsCount: 8,
  },
];

const mockLibraries = [
    { id: 1, name: "도서관1", location: "서울", website: "https://library1.example.com" },
    { id: 2, name: "도서관2", location: "부산", website: "https://library2.example.com" },
  ];  

const mockReviews = [
  { id: 1, title: "감동적인 이야기", author: "작성자1", rating: 4 },
  { id: 2, title: "유익한 내용", author: "작성자2", rating: 5 },
];

const BookPage = () => {
  const { id } = useParams();
  const book = mockBooks.find((book) => book.id === parseInt(id, 10));

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    title: "",
    content: "",
    rating: 0,
  });
  const [error, setError] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const { title, content, rating } = newReview;

    // 검증: 누락된 입력 필드가 있는 경우
    if (!title || !content || rating <= 0) {
      setError("모든 필드를 올바르게 입력해주세요.");
      return;
    }

    setError(""); // 에러 메시지 초기화
    console.log("New Review Submitted:", newReview);
    setShowReviewForm(false); // 폼 닫기
    setNewReview({ title: "", content: "", rating: 0 }); // 폼 초기화
  };

  if (!book) {
    return (
      <div className="main-page-container">
        <Navbar />
        <p><br></br><br></br></p>
        <p>해당 책을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="main-page-container">
      <Navbar />
      <div className="book-page">
        {/* 책 정보 섹션 */}
        <BookInfo book={book} />

        {/* 소장 도서관 섹션 */}
        <div className="libraries-container">
          <h2>소장 도서관</h2>
          <ul className="libraries-list">
            {mockLibraries.map((library) => (
              <li key={library.id} className="library-item">
                <p className="library-name">{library.name}</p>
                <a
                  href={library.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="library-link"
                >
                  홈페이지
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 서평 테이블 */}
        <div className="reviews-container">
          <h2>서평</h2>
          <table className="reviews-table">
            <thead>
              <tr>
                <th>서평 제목</th>
                <th>작성자</th>
                <th>평점</th>
              </tr>
            </thead>
            <tbody>
              {mockReviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <Link to={`/reviews/${review.id}`}>{review.title}</Link>
                  </td>
                  <td>{review.author}</td>
                  <td>{review.rating} / 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 서평 추가 버튼 및 폼 */}
        <div className="add-review-container">
          <button onClick={() => setShowReviewForm(!showReviewForm)}>
            서평 추가
          </button>
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <label>
                별점:
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: e.target.value })
                  }
                />
              </label>
              <label>
                제목:
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview({ ...newReview, title: e.target.value })
                  }
                />
              </label>
              <label>
                내용:
                <textarea
                  value={newReview.content}
                  onChange={(e) =>
                    setNewReview({ ...newReview, content: e.target.value })
                  }
                />
              </label>
              {error && <p className="error-message">{error}</p>}
              <button type="submit">저장</button>
              <button type="button" onClick={() => setShowReviewForm(false)}>
                닫기
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
