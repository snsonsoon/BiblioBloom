import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import BookInfo from "../components/Cards/BookInfo";
import "./Page.css";

const mockReviews = [
  {
    id: 1,
    title: "감동적인 이야기",
    content: "이 책은 정말 감동적이었습니다. 꼭 읽어보세요!",
    book: {
      title: "책 제목1",
      author: "작가1",
      publisher: "출판사1",
      year: 2022,
      genre: "문학",
      averageRating: 4.5,
      reviewsCount: 12,
    },
    author: "작성자1",
    likes: 14,
    userRating: 4, // 작성자가 준 평점
  },
  {
    id: 2,
    title: "흥미로운 분석",
    content: "분석이 정말 뛰어난 책입니다.",
    book: {
      title: "책 제목2",
      author: "작가2",
      publisher: "출판사2",
      year: 2021,
      genre: "경제",
      averageRating: 4.0,
      reviewsCount: 8,
    },
    author: "작성자2",
    likes: 10,
    userRating: 5, // 작성자가 준 평점
  },
  {
    id: 3,
    title: "좋은 책 추천",
    content: "분석이 정말 뛰어난 책입니다.",
    book: {
      title: "책 제목3",
      author: "작가3",
      publisher: "출판사3",
      year: 2021,
      genre: "경제",
      averageRating: 4.0,
      reviewsCount: 8,
    },
    author: "작성자3",
    likes: 10,
    userRating: 3
  }
];

const ReviewPage = () => {
    const { id } = useParams();
    const review = mockReviews.find((review) => review.id === parseInt(id, 10));
    const [likes, setLikes] = useState(review.likes);
  
    const handleLike = () => {
      setLikes((prevLikes) => prevLikes + 1);
    };
  
    if (!review) {
      return (
        <div className="review-page">
          <Navbar />
          <p>해당 리뷰를 찾을 수 없습니다.</p>
        </div>
      );
    }
  
    return (
      <div className="main-page-container">
        <Navbar />
        <div className="review-page">
          {/* 책 정보 블록 */}
          <BookInfo book={review.book} />
          
          {/* 리뷰 상세 정보 블록 */}
          <div className="review-details-container">
            <h3>{review.title}</h3>
            <p><strong>작성자:</strong> {review.author}</p>
            <p>{review.content}</p>
            <p><strong>작성자의 평점:</strong> {review.userRating} / 5</p>
            <div className="like-section">
              <button onClick={handleLike} className="like-button">공감하기</button>
              <span className="like-count">{likes} 공감</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ReviewPage;
