import React, { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import { Link } from "react-router-dom";
import "./Page.css";
import BookInfo from "../components/Cards/BookInfo";

const SearchBook = () => {
  // Mock 데이터
  const books = [
    { id: 1, title: "책 제목1", author: "작가1", year: 2022, reviews: 10, rating: 4.5, coverImage: "https://via.placeholder.com/120"},
    { id: 2, title: "책 제목2", author: "작가2", year: 2021, reviews: 8, rating: 4.0, coverImage: "https://via.placeholder.com/120" },
    { id: 3, title: "책 제목3", author: "작가3", year: 2023, reviews: 15, rating: 4.8, coverImage: "https://via.placeholder.com/120" },
    { id: 4, title: "책 제목4", author: "작가4", year: 2019, reviews: 5, rating: 3.9, coverImage: "https://via.placeholder.com/120" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriterion, setSortCriterion] = useState("title");

  // 필터링 및 정렬
  const filteredBooks = books
    .filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortCriterion === "year") return b.year - a.year;
      if (sortCriterion === "reviews") return b.reviews - a.reviews;
      if (sortCriterion === "rating") return b.rating - a.rating;
      if (sortCriterion === "title") return a.title.localeCompare(b.title);
      return 0;
    });

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
        {/* <div className="book-list">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-row"> */}
            {/* 책 표지 */}
            {/* <img 
              className="book-cover" 
              src={book.coverImage} 
              alt={`${book.title} 표지`} 
            /> */}
            {/* 책 정보 */}
            {/* <div className="book-info">
              <p>
                <strong>제목:</strong> 
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </p>
              <p><strong>저자:</strong> {book.author}</p>
              <p><strong>출간 연도:</strong> {book.year}</p>
              <p><strong>평점:</strong> {book.rating} ({book.reviews})</p>
            </div>
          </div>
        ))}
      </div> */}
      {/* 검색 결과 */}
      <div className="book-list">
        {filteredBooks.map((book) => (
          <BookInfo key={book.id} book={{ 
            ...book, 
            averageRating: book.rating, 
            reviewsCount: book.reviews 
          }} showLink={true} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default SearchBook;