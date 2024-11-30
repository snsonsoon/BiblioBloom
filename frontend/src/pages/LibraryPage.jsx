import React, { useEffect, useState } from "react";
import Navbar from "../components/Layout/Navbar";
import { Link, useParams } from "react-router-dom";
import { getLibraryDetails, getBooksByLibrary } from "../services/api"; // API 호출 함수
import "./Page.css";
import Footer from "../components/Layout/Footer";

const LibraryPage = () => {
  const { id } = useParams(); // URL에서 library_id 가져오기
  const [library, setLibrary] = useState(null); // 도서관 정보 상태
  const [books, setBooks] = useState([]); // 소장 도서 목록 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        // 도서관 정보 가져오기
        const libraryData = await getLibraryDetails(id);
        setLibrary(libraryData);
        // 소장 도서 목록 가져오기
        const bookData = await getBooksByLibrary(id);
        setBooks(bookData);
      } catch (err) {
        setError("도서관 정보를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibraryData();
  }, [id]);
  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!library) return <p>해당 도서관을 찾을 수 없습니다.</p>;
  return (
    <div className="main-page-container">
      <Navbar />
      <div className="library-page">
        {/* 도서관 정보 섹션 */}
        <div className="library-info">
          <h2>{library.library_name}</h2>
          <p><strong>주소:</strong> {library.address}</p>
          <p>
            <strong>홈페이지:</strong>{" "}
            <a href={library.homepage} target="_blank" rel="noopener noreferrer">
              {library.homepage}
            </a>
          </p>
        </div>
        {/* 소장 도서 목록 섹션 */}
        <div className="library-books">
          <h2>소장 도서</h2>
          {books.length === 0 ? (
            <p>소장 도서 정보가 없습니다.</p>
          ) : (
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
                {books.map((book) => (
                  <tr key={book.isbn}>
                    <td>
                      <Link to={`/books/${book.isbn}`}>{book.book_title}</Link>
                    </td>
                    <td>{book.author}</td>
                    <td>{book.publication_year}</td>
                    <td>{book.average_rating} / 5</td>
                    <td>{book.total_reviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};
export default LibraryPage;