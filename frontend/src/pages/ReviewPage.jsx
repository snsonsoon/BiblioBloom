import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import BookInfo from "../components/Cards/BookInfo";
import {
  getReviewDetails,
  likeReview,
  getBookDetails,
  deleteReview,
  updateReview,
} from "../services/api"; // API 추가
import Footer from "../components/Layout/Footer";

const ReviewPage = () => {
  const { isbn, user_id } = useParams(); // URL에서 isbn, user_id 가져오기
  const navigate = useNavigate(); // 페이지 이동용
  const [review, setReview] = useState(null); // 리뷰 데이터
  const [bookDetails, setBookDetails] = useState(null); // 책 상세 데이터
  const [likes, setLikes] = useState(0); // 공감 수
  const [isAuthor, setIsAuthor] = useState(false); // 작성자인지 여부
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [editedReview, setEditedReview] = useState({}); // 수정 중인 리뷰 데이터
  const [error, setError] = useState(""); // 에러 상태
  // 초기 데이터 로드
  useEffect(() => {
    const fetchReviewAndBook = async () => {
      try {
        const reviewData = await getReviewDetails(isbn, user_id);
        setReview(reviewData);
        setLikes(reviewData.likes);
        const currentUser = localStorage.getItem("user_id"); // 현재 로그인된 사용자 ID 가져오기
        setIsAuthor(currentUser === reviewData.user_id);
        const bookData = await getBookDetails(isbn);
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
      const updatedReview = await likeReview(review.isbn, review.user_id);
      setLikes(updatedReview.likes);
    } catch (err) {
      setError("Failed to update likes.");
      console.error(err);
    }
  };
  const handleDelete = async () => {
    if (window.confirm("정말로 이 서평을 삭제하시겠습니까?")) {
      try {
        await deleteReview(isbn, user_id); // 리뷰 삭제 API 호출
        alert("서평이 삭제되었습니다.");
        navigate("/reviews"); // 서평 목록 페이지로 이동
      } catch (err) {
        setError("Failed to delete the review.");
        console.error(err);
      }
    }
  };
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedReview({ ...review });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedReview((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveEdit = async () => {
    try {
      const updatedReview = await updateReview(isbn, user_id, editedReview); // 수정된 데이터 전송
      setReview(updatedReview); // 상태 업데이트
      setIsEditing(false); // 수정 모드 종료
      alert("서평이 수정되었습니다.");
    } catch (err) {
      setError("Failed to save the review.");
      console.error(err);
    }
  };
  if (error) return <p>{error}</p>;
  if (!review || !bookDetails) return <p>Loading...</p>;
  return (
    <div className="main-page-container">
      <Navbar />
      <div className="review-page">
        <BookInfo book={bookDetails} />
        <div className="review-details-container">
          {isEditing ? (
            <form className="edit-review-form">
              <h3>서평 수정</h3>
              <div className="form-group">
                <label htmlFor="review_title">제목:</label>
                <input
                  type="text"
                  id="review_title"
                  name="review_title"
                  value={editedReview.review_title}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="body">내용:</label>
                <textarea
                  id="body"
                  name="body"
                  value={editedReview.body}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rating">평점:</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={editedReview.rating}
                  min="1"
                  max="5"
                  onChange={handleEditChange}
                />
              </div>
              <div className="action-buttons">
                <button onClick={handleSaveEdit} className="save-button">
                  저장
                </button>
                <button onClick={handleEditToggle} className="cancel-button">
                  취소
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3>{review.review_title}</h3>
              <p><strong>Author:</strong> {review.nickname}</p>
              <p>{review.body}</p>
              <p><strong>User Rating:</strong> {review.rating} / 5</p>
              <div className="like-section">
                <button onClick={handleLike} className="like-button">공감하기</button>
                <span className="like-count">{likes} 공감</span>
              </div>
              {isAuthor && (
                <div className="review-actions">
                  <button onClick={handleEditToggle} className="edit-button">수정</button>
                  <button onClick={handleDelete} className="delete-button">삭제</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default ReviewPage;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../components/Layout/Navbar";
// import BookInfo from "../components/Cards/BookInfo";
// import { getReviewDetails, likeReview, getBookDetails, deleteReview, updateReview } from "../services/api"; // API 추가
// import Footer from "../components/Layout/Footer";
// const ReviewPage = () => {
//   const { isbn, user_id } = useParams(); // URL에서 isbn, user_id 가져오기
//   const navigate = useNavigate(); // 페이지 이동용
//   const [review, setReview] = useState(null); // 리뷰 데이터
//   const [bookDetails, setBookDetails] = useState(null); // 책 상세 데이터
//   const [likes, setLikes] = useState(0); // 공감 수
//   const [isAuthor, setIsAuthor] = useState(false); // 작성자인지 여부
//   const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
//   const [editedReview, setEditedReview] = useState({}); // 수정 중인 리뷰 데이터
//   const [error, setError] = useState(""); // 에러 상태
//   // 초기 데이터 로드
//   useEffect(() => {
//     const fetchReviewAndBook = async () => {
//       try {
//         const reviewData = await getReviewDetails(isbn, user_id);
//         setReview(reviewData);
//         setLikes(reviewData.likes);
//         const currentUser = localStorage.getItem("user_id"); // 현재 로그인된 사용자 ID 가져오기
//         setIsAuthor(currentUser === reviewData.user_id);
//         const bookData = await getBookDetails(isbn);
//         setBookDetails(bookData);
//       } catch (err) {
//         setError("Failed to fetch review or book details.");
//         console.error(err);
//       }
//     };
//     fetchReviewAndBook();
//   }, [isbn, user_id]);
//   // 공감 추가
//   const handleLike = async () => {
//     try {
//       const updatedReview = await likeReview(review.isbn, review.user_id);
//       setLikes(updatedReview.likes);
//     } catch (err) {
//       setError("Failed to update likes.");
//       console.error(err);
//     }
//   };
//   // 서평 삭제
//   const handleDelete = async () => {
//     if (window.confirm("정말로 이 서평을 삭제하시겠습니까?")) {
//       try {
//         await deleteReview(isbn, user_id); // 리뷰 삭제 API 호출
//         alert("서평이 삭제되었습니다.");
//         navigate("/reviews"); // 서평 목록 페이지로 이동
//       } catch (err) {
//         setError("Failed to delete the review.");
//         console.error(err);
//       }
//     }
//   };
//   // 수정 모드 토글
//   const handleEditToggle = () => {
//     setIsEditing(!isEditing);
//     setEditedReview({ ...review });
//   };
//   // 수정 폼 변경
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditedReview((prev) => ({ ...prev, [name]: value }));
//   };
//   // 수정 저장
//   const handleSaveEdit = async () => {
//     try {
//       const updatedReview = await updateReview(isbn, user_id, editedReview); // 수정된 데이터 전송
//       setReview(updatedReview); // 상태 업데이트
//       setIsEditing(false); // 수정 모드 종료
//       alert("서평이 수정되었습니다.");
//     } catch (err) {
//       setError("Failed to save the review.");
//       console.error(err);
//     }
//   };
//   if (error) return <p>{error}</p>;
//   if (!review || !bookDetails) return <p>Loading...</p>;
//   return (
//     <div className="main-page-container">
//       <Navbar />
//       <div className="review-page">
//         <BookInfo book={bookDetails} />
//         <div className="review-details-container">
//           {isEditing ? (
//             <div className="edit-review-form">
//               <h3>서평 수정</h3>
//               <label>
//                 제목:
//                 <input
//                   type="text"
//                   name="review_title"
//                   value={editedReview.review_title}
//                   onChange={handleEditChange}
//                 />
//               </label>
//               <label>
//                 내용:
//                 <textarea
//                   name="body"
//                   value={editedReview.body}
//                   onChange={handleEditChange}
//                 />
//               </label>
//               <label>
//                 평점:
//                 <input
//                   type="number"
//                   name="rating"
//                   value={editedReview.rating}
//                   min="1"
//                   max="5"
//                   onChange={handleEditChange}
//                 />
//               </label>
//               <button onClick={handleSaveEdit}>저장</button>
//               <button onClick={handleEditToggle}>취소</button>
//             </div>
//           ) : (
//             <>
//               <h3>{review.review_title}</h3>
//               <p><strong>Author:</strong> {review.nickname}</p>
//               <p>{review.body}</p>
//               <p><strong>User Rating:</strong> {review.rating} / 5</p>
//               <div className="like-section">
//                 <button onClick={handleLike} className="like-button">공감하기</button>
//                 <span className="like-count">{likes} 공감</span>
//               </div>
//               {isAuthor && (
//                 <div className="review-actions">
//                   <button onClick={handleEditToggle} className="edit-button">수정</button>
//                   <button onClick={handleDelete} className="delete-button">삭제</button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };
// export default ReviewPage;