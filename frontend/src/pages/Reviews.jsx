import React, { useState } from "react";
import "./Page.css";
import Navbar from "../components/Layout/Navbar";
import { Link } from "react-router-dom";

const Reviews = () => {
  const [sortCriterion, setSortCriterion] = useState("likes");

  // Mock 데이터
  const bestReviews = [
    { id: 1, title: "감동적인 이야기", book: "책 제목1", author: "작성자1", likes: 14 },
    { id: 2, title: "흥미로운 분석", book: "책 제목2", author: "작성자2", likes: 10 },
    { id: 3, title: "좋은 책 추천", book: "책 제목3", author: "작성자3", likes: 8 },
  ];

  const allReviews = [
    { id: 1, title: "감동적인 이야기", book: "책 제목1", author: "작성자1", likes: 14, date: "2024-11-26", userRating: 4 },
    { id: 2, title: "흥미로운 분석", book: "책 제목2", author: "작성자2", likes: 10, date: "2024-11-27", userRating: 5 },
    { id: 3, title: "좋은 책 추천", book: "책 제목3", author: "작성자3", likes: 8, date: "2024-11-25", userRating: 3 },
  ];  

  const sortedReviews = [...allReviews].sort((a, b) => {
    if (sortCriterion === "likes") return b.likes - a.likes;
    if (sortCriterion === "date") return new Date(b.date) - new Date(a.date);
    return 0;
  });

  return (
    <div className="main-page-container">
      <Navbar />
      <div className="reviews-page">
        {/* 이달의 Best 서평 섹션 */}
        <section className="best-reviews-section">
          <h2>이달의 Best 서평</h2>
          <div className="best-reviews-container">
            {bestReviews.map((review) => (
              <div key={review.id} className="best-review-card">
                <h3>
                  <Link to={`/reviews/${review.id}`}>{review.title}</Link>
                </h3>
                <p>책: {review.book}</p>
                <p>작성자: {review.author}</p>
                <p>공감 수: {review.likes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 전체 서평 목록 */}
        <h2>전체 서평 목록</h2>
        <div className="sorting-options">
          <label htmlFor="sort">정렬 기준:</label>
          <select
            id="sort"
            name="sort"
            value={sortCriterion}
            onChange={(e) => setSortCriterion(e.target.value)}
          >
            <option value="likes">공감 수</option>
            <option value="date">최신순</option>
          </select>
        </div>
        <table className="reviews-table">
          <thead>
            <tr>
              <th>서평 제목</th>
              <th>책 제목</th>
              <th>작성자</th>
              <th>공감 수</th>
            </tr>
          </thead>
          <tbody>
            {sortedReviews.map((review) => (
              <tr key={review.id}>
                <td>
                  <Link to={`/reviews/${review.id}`}>{review.title}</Link>
                </td>
                <td>{review.book}</td>
                <td>{review.author}</td>
                <td>{review.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reviews;
