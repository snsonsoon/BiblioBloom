import React from "react";
import Navbar from "../components/Layout/Navbar";
import { Link, useParams } from "react-router-dom";
import "./Page.css";

// Mock 데이터
const mockLibraries = [
  {
    id: 1,
    name: "서울시 강남구 도서관",
    address: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    website: "https://library1.example.com",
    books: [
      { id: 1, title: "책 제목1", author: "작가1", year: 2022, reviews: 10, rating: 4.5 },
      { id: 2, title: "책 제목2", author: "작가2", year: 2021, reviews: 8, rating: 4.0 },
    ],
  },
  {
    id: 2,
    name: "부산시 해운대구 도서관",
    address: "부산시 해운대구 센텀로 456",
    phone: "051-9876-5432",
    website: "https://library2.example.com",
    books: [
      { id: 3, title: "책 제목3", author: "작가3", year: 2023, reviews: 15, rating: 4.8 },
      { id: 4, title: "책 제목4", author: "작가4", year: 2019, reviews: 5, rating: 3.9 },
    ],
  },
];

const LibraryPage = () => {
  const { id } = useParams();
  const library = mockLibraries.find((lib) => lib.id === parseInt(id, 10));

  if (!library) {
    return (
      <div className="main-page-container">
        <Navbar />
        <p>해당 도서관을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="main-page-container">
      <Navbar />
      <div className="library-page">
        {/* 도서관 정보 섹션 */}
        <div className="library-info">
          <h2>{library.name}</h2>
          <p><strong>주소:</strong> {library.address}</p>
          <p><strong>전화번호:</strong> {library.phone}</p>
          <p>
            <strong>홈페이지:</strong>{" "}
            <a href={library.website} target="_blank" rel="noopener noreferrer">
              {library.website}
            </a>
          </p>
        </div>

        {/* 소장 도서 목록 섹션 */}
        <div className="library-books">
          <h2>소장 도서 Top 10</h2>
          <table className="books-table">
            <thead>
              <tr>
                <th>도서 제목</th>
                <th>저자</th>
                <th>출간 연도</th>
                <th>평점</th>
                <th>서평 개수</th>
              </tr>
            </thead>
            <tbody>
              {library.books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.year}</td>
                  <td>{book.rating} / 5</td>
                  <td>{book.reviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
