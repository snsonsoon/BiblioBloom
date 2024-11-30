import React, { useEffect, useState } from "react";
import Navbar from "../components/Layout/Navbar";
import { Link } from "react-router-dom";
import { getSortedReviews , getTopReviews} from "../services/api";
import "./Page.css";
import Footer from "../components/Layout/Footer";

const Reviews = () => {
  const [bestReviews, setBestReviews] = useState([]); // 이달의 Best 서평
  const [allReviews, setAllReviews] = useState([]); // 전체 서평
  const [sortCriterion, setSortCriterion] = useState("likes"); // 정렬 기준
  const [error, setError] = useState(""); // 에러 메시지
  // API 호출로 데이터 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Best 서평 (공감 순 정렬, 제한 3개)
        const best = await getTopReviews("likes");
        setBestReviews(best);
        // 전체 서평 (현재 정렬 기준으로 가져오기)
        const all = await getSortedReviews(sortCriterion);
        setAllReviews(all);
      } catch (err) {
        setError("서평 데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      }
    };
    fetchReviews();
  }, [sortCriterion]); // 정렬 기준이 바뀔 때마다 실행
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="main-page-container">
      <Navbar />
      <div className="reviews-page">
        {/* 이달의 Best 서평 섹션 */}
        <section className="best-reviews-section">
          <h2>이달의 Best 서평</h2>
          <div className="best-reviews-container">
            {bestReviews.map((review) => (
              <div key={`${review.isbn}/${review.user_id}`} className="best-review-card">
                <h3>
                  <Link to={`/reviews/${review.isbn}/${review.user_id}`}>
                    {review.review_title}
                  </Link>
                </h3>
                <p>책: {review.book_title}</p>
                <p>작성자: {review.nickname}</p>
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
            <option value="newest">최신순</option>
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
            {allReviews.map((review) => (
              <tr key={`${review.isbn}/${review.user_id}`}>
                <td>
                  <Link to={`/reviews/${review.isbn}/${review.user_id}`}>
                    {review.review_title}
                  </Link>
                </td>
                <td>{review.book_title}</td>
                <td>{review.nickname}</td>
                <td>{review.likes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer/>
    </div>
  );
};
export default Reviews;