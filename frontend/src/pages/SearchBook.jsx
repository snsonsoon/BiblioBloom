import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import BookInfo from "../components/Cards/BookInfo";
import { getBooks } from "../services/api"; // 도서 목록 가져오는 API 함수
import "./Page.css";
const SearchBook = () => {
  const [books, setBooks] = useState([]); // 도서 목록
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [sortCriterion, setSortCriterion] = useState("title"); // 정렬 기준
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  // 도서 데이터를 가져오는 함수
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getBooks(); // 도서 목록 API 호출
      setBooks(response); // API 데이터로 상태 업데이트
    } catch (err) {
      console.error("API 요청 중 오류:", err);
      setError("도서를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBooks(); // 컴포넌트 마운트 시 API 호출
  }, []);
  // 필터링 및 정렬된 도서 목록 생성
  const filteredBooks = books
    .filter((book) =>
      book.book_title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortCriterion === "year") return b.publication_year - a.publication_year;
      if (sortCriterion === "reviews") return b.total_reviews - a.total_reviews;
      if (sortCriterion === "rating") return b.average_rating - a.average_rating;
      if (sortCriterion === "title") return a.book_title.localeCompare(b.book_title);
      return 0;
    });
  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="main-page-container">
      <Navbar />
      <div className="search-book-page">
        {/* 검색 섹션 */}
        <div className="search-section">
          <input
            type="text"
            placeholder="도서를 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="sort-section">
            <select
              value={sortCriterion}
              onChange={(e) => setSortCriterion(e.target.value)}
              className="sort-select"
            >
              <option value="title">ㄱㄴㄷ순</option>
              <option value="year">출간 연도 별</option>
              <option value="reviews">서평 개수 많은 순</option>
              <option value="rating">평점 높은 순</option>
            </select>
          </div>
        </div>
        {/* 검색 결과 */}
        <div className="book-list">
          {filteredBooks.map((book) => (
            <BookInfo
              key={book.isbn}
              book={{
                isbn: book.isbn, // 링크 생성에 필요한 id
                book_title: book.book_title, // 제목
                author: book.author, // 저자
                publication_year: book.publication_year, // 출간 연도
                cover_image: book.cover_image, // 표지 이미지
                average_rating: book.average_rating, // 평균 평점
                total_reviews: book.total_reviews, // 서평 개수
                genre: book.genre, // 장르
              }}
              showLink={true} // 도서 상세 페이지 링크 표시
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default SearchBook;