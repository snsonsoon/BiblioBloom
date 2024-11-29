import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import BookInfo from "../components/Cards/BookInfo";
import { getBookDetails, getLibrariesByBook, getReviewsByBook, addReview } from "../services/api";
import "./Page.css";
const BookPage = () => {
  const { id: bookId } = useParams(); // URL에서 bookId 가져오기
  const [book, setBook] = useState(null); // 책 정보
  const [libraries, setLibraries] = useState([]); // 도서관 정보
  const [reviews, setReviews] = useState([]); // 서평 정보
  const [error, setError] = useState(""); // 에러 상태
  // 서평 작성 상태
  const [newReview, setNewReview] = useState({
    review_title: "",
    body: "",
    rating: 0,
  });
  const [formError, setFormError] = useState(""); // 폼 에러 상태
  const [showReviewForm, setShowReviewForm] = useState(false); // 폼 보이기 상태
  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookDetails = await getBookDetails(bookId);
        setBook(bookDetails);
        const libraryData = await getLibrariesByBook(bookId);
        setLibraries(libraryData);
        const reviewData = await getReviewsByBook(bookId);
        setReviews(reviewData);
      } catch (err) {
        setError("데이터를 가져오는 중 문제가 발생했습니다.");
        console.error(err);
      }
    };
    fetchData();
  }, [bookId]);
  // 서평 제출 핸들러
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const { review_title, body, rating } = newReview;
    // 검증
    if (!review_title || !body || rating <= 0) {
      setFormError("모든 필드를 올바르게 입력해주세요.");
      return;
    }
    try {
      const userId = localStorage.getItem("user_id");
      const addedReview = await addReview({
        isbn: bookId,
        user_id: userId,
        review_title,
        body,
        rating: parseInt(rating, 5),
      });
      // 성공적으로 추가된 경우
      setReviews((prev) => [...prev, { ...addedReview, id: `${addedReview.isbn}-${addedReview.user_id}` }]);
      setShowReviewForm(false); // 폼 닫기
      setNewReview({ isbn: "", user_id: "", review_title: "", body: "", rating: 1 }); // 폼 초기화
      setFormError(""); // 에러 초기화
    } catch (err) {
      setFormError("서평 추가 중 문제가 발생했습니다.");
      console.error(err);
    }
  };
  if (error) return <p>{error}</p>;
  if (!book) return <p>로딩 중...</p>;
  return (
    <div className="main-page-container">
      <Navbar />
      <div className="book-page">
        {/* 책 정보 */}
        <BookInfo book={book} />
        {/* 소장 도서관 정보 */}
        <div className="libraries-container">
          <h2>소장 도서관</h2>
          {libraries.length === 0 ? (
            <p>소장 도서관 정보가 없습니다.</p>
          ) : (
            <table className="libraries-table">
              <thead>
                <tr>
                  <th>도서관 이름</th>
                  <th>위치</th>
                  <th>홈페이지</th>
                </tr>
              </thead>
              <tbody>
                {libraries.map((library) => (
                  <tr key={library.library_id}>
                    <td>{library.library_name}</td>
                    <td>{library.address}</td>
                    <td>
                      <a href={library.homepage} target="_blank" rel="noopener noreferrer">
                        홈페이지
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* 서평 정보 */}
        <div className="reviews-container">
          <h2>서평</h2>
          {reviews.length === 0 ? (
            <p>서평이 없습니다. 첫 서평을 작성해보세요!</p>
          ) : (
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>서평 제목</th>
                  <th>작성자</th>
                  <th>평점</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <Link to={`/reviews/${review.id}`}>{review.review_title}</Link>
                    </td>
                    <td>{review.nickname}</td>
                    <td>{review.rating} / 5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* 서평 추가 버튼 및 폼 */}
        <div className="add-review-container">
          <button onClick={() => setShowReviewForm(!showReviewForm)}>서평 추가</button>
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <label>
                제목:
                <input
                  type="text"
                  value={newReview.review_title}
                  onChange={(e) => setNewReview({ ...newReview, review_title: e.target.value })}
                />
              </label>
              <label>
                내용:
                <textarea
                  value={newReview.body}
                  onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                />
              </label>
              <label>
                별점:
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                />
              </label>
              {formError && <p className="error-message">{formError}</p>}
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

// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import Navbar from "../components/Layout/Navbar";
// import BookInfo from "../components/Cards/BookInfo";
// import { getBookDetails, getLibrariesByBook, getReviewsByBook, addReview } from "../services/api";
// import "./Page.css";
// const BookPage = () => {
//   const { id: bookId } = useParams(); // URL에서 bookId 가져오기
//   const [book, setBook] = useState(null); // 책 정보
//   const [libraries, setLibraries] = useState([]); // 도서관 정보
//   const [reviews, setReviews] = useState([]); // 서평 정보
//   const [error, setError] = useState(""); // 에러 상태
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 책 상세 정보 가져오기
//         const bookDetails = await getBookDetails(bookId);
//         setBook(bookDetails);
//         // 도서관 정보 가져오기
//         const libraryData = await getLibrariesByBook(bookId);
//         setLibraries(libraryData);
//         // 서평 정보 가져오기
//         const reviewData = await getReviewsByBook(bookId);
//         setReviews(reviewData);
//       } catch (err) {
//         setError("데이터를 가져오는 중 문제가 발생했습니다.");
//         console.error(err);
//       }
//     };
//     fetchData();
//   }, [bookId]);
//   if (error) return <p>{error}</p>;
//   if (!book) return <p>로딩 중...</p>;
//   return (
//     <div className="main-page-container">
//       <Navbar />
//       <div className="book-page">
//         {/* 책 정보 */}
//         <BookInfo book={book} />
//         {/* 소장 도서관 정보 */}
//         <div className="libraries-container">
//           <h2>소장 도서관</h2>
//           {libraries.length === 0 ? (
//             <p>소장 도서관 정보가 없습니다.</p>
//           ) : (
//             <table className="libraries-table">
//               <thead>
//                 <tr>
//                   <th>도서관 이름</th>
//                   <th>위치</th>
//                   <th>홈페이지</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {libraries.map((library) => (
//                   <tr key={library.library_id}>
//                     <td>{library.library_name}</td>
//                     <td>{library.address}</td>
//                     <td>
//                       <a
//                         href={library.homepage}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         홈페이지
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//         {/* 서평 정보 */}
//         <div className="reviews-container">
//           <h2>서평</h2>
//           {reviews.length === 0 ? (
//             <p>서평이 없습니다. 첫 서평을 작성해보세요!</p>
//           ) : (
//             <table className="reviews-table">
//               <thead>
//                 <tr>
//                   <th>서평 제목</th>
//                   <th>작성자</th>
//                   <th>평점</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reviews.map((review) => (
//                   <tr key={review.id}>
//                     <td>
//                       <Link to={`/reviews/${review.id}`}>{review.review_title}</Link>
//                     </td>
//                     <td>{review.nickname}</td>
//                     <td>{review.rating} / 5</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default BookPage;