import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import BookInfo from "../components/Cards/BookInfo";
import  { getReviewDetails, likeReview, getBookDetails }  from "../services/api";
const ReviewPage = () => {
  const { isbn, user_id } = useParams(); // URL에서 isbn, user_id 가져오기
  const [review, setReview] = useState(null); // 리뷰 데이터
  const [bookDetails, setBookDetails] = useState(null); // 책 상세 데이터
  const [likes, setLikes] = useState(0); // 공감 수
  const [error, setError] = useState(""); // 에러 상태
  useEffect(() => {
    console.log("Params:", { isbn, user_id }); // 디버깅용 로그 추가
    const fetchReviewAndBook = async () => {
      try {
        // 리뷰 정보 가져오기
        const reviewData = await getReviewDetails(isbn, user_id);
        setReview(reviewData);
        setLikes(reviewData.likes);
        // 책 상세 정보 가져오기
        const bookData = await getBookDetails(isbn); // BookPage에서 사용한 API
        setBookDetails(bookData);
      } catch (err) {
        setError("Failed to fetch review or book details.");
        console.error(err);
      }
    };
    fetchReviewAndBook();
  }, [isbn, user_id]);
  const handleLike = async () => {
    try {
      const updatedReview = await likeReview(review.isbn, review.user_id); // ISBN과 User ID 전달
      setLikes(updatedReview.likes);
    } catch (err) {
      setError("Failed to update likes.");
      console.error(err);
    }
  };
  if (error) return <p>{error}</p>;
  if (!review || !bookDetails) return <p>Loading...</p>;
  return (
    <div className="main-page-container">
      <Navbar />
      <div className="review-page">
        {/* BookInfo 컴포넌트에 책 상세 데이터 전달 */}
        <BookInfo book={bookDetails} />
        <div className="review-details-container">
          <h3>{review.review_title}</h3>
          <p><strong>Author:</strong> {review.nickname}</p>
          <p>{review.body}</p>
          <p><strong>User Rating:</strong> {review.rating} / 5</p>
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

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Navbar from "../components/Layout/Navbar";
// import BookInfo from "../components/Cards/BookInfo";
// import { getReviewDetails, likeReview } from "../services/api"; // API 함수 가져오기
// import "./Page.css";
// const ReviewPage = () => {
//   const { id } = useParams(); // URL에서 리뷰 ID 가져오기
//   const [review, setReview] = useState(null); // 리뷰 정보 상태
//   const [likes, setLikes] = useState(0); // 공감 수 상태
//   const [error, setError] = useState(""); // 에러 메시지 상태
//   // 리뷰 데이터 가져오기
//   useEffect(() => {
//     const fetchReview = async () => {
//       try {
//         const reviewData = await getReviewDetails(id); // API에서 리뷰 데이터 가져오기
//         setReview(reviewData);
//         setLikes(reviewData.likes); // 초기 공감 수 설정
//       } catch (err) {
//         setError("리뷰 데이터를 가져오는 중 오류가 발생했습니다.");
//         console.error(err);
//       }
//     };
//     fetchReview();
//   }, [id]);
//   // 공감 버튼 클릭 처리
//   const handleLike = async () => {
//     if (!review) return;
//     try {
//       const updatedReview = await likeReview(review.isbn, review.user_id); // API 호출
//       setLikes(updatedReview.likes); // 업데이트된 공감 수 반영
//     } catch (err) {
//       setError("공감 수를 업데이트하는 중 문제가 발생했습니다.");
//       console.error(err);
//     }
//   };
//   if (error) return <p>{error}</p>;
//   if (!review) return <p>리뷰 데이터를 로드 중입니다...</p>;
//   return (
//     <div className="main-page-container">
//       <Navbar />
//       <div className="review-page">
//         {/* 책 정보 블록 */}
//         <BookInfo book={review.book} />
//         {/* 리뷰 상세 정보 블록 */}
//         <div className="review-details-container">
//           <h3>{review.review_title}</h3>
//           <p><strong>작성자:</strong> {review.nickname}</p>
//           <p>{review.body}</p>
//           <p><strong>작성자의 평점:</strong> {review.rating} / 5</p>
//           <div className="like-section">
//             <button onClick={handleLike} className="like-button">공감하기</button>
//             <span className="like-count">{likes} 공감</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ReviewPage;