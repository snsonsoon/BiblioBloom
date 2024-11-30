import React, { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import { Link } from "react-router-dom";
import { searchLibraries } from "../services/api"; // API 함수 불러오기
import "./Page.css";
const SearchLib = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [libraries, setLibraries] = useState([]); // 도서관 목록 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await searchLibraries(searchTerm); // 검색어 전달
        setLibraries(data);
      } catch (err) {
        setError("도서관 데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibraries();
  }, [searchTerm]);
  return (
    <div className="main-page-container">
      <Navbar />
      <div className="search-lib-page">
        {/* 검색 섹션 */}
        <div className="search-section">
          <input
            type="text"
            placeholder="도서관 이름을 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {/* 검색 결과 */}
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="libraries-list">
            {libraries.length === 0 ? (
              <p>검색 결과가 없습니다.</p>
            ) : (
              libraries.map((library) => (
                <div key={library.library_id} className="library-item">
                  <h3>
                    <Link to={`/libraries/${library.library_id}`}>{library.library_name}</Link>
                  </h3>
                  <p>{library.address}</p>
                  <a href={library.homepage} target="_blank" rel="noopener noreferrer">
                    홈페이지
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchLib;