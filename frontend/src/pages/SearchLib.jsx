// import React, { useState } from "react";
// import Navbar from "../components/Layout/Navbar";
// import { Link } from "react-router-dom";
// import "./Page.css";

// const SearchLib = () => {
//   // Mock 데이터
//   const libraries = [
//     { id: 1, name: "서울시 강남구 도서관", address: "서울시 강남구 테헤란로 123", website: "https://library1.example.com" },
//     { id: 2, name: "부산시 해운대구 도서관", address: "부산시 해운대구 센텀로 456", website: "https://library2.example.com" },
//     { id: 3, name: "대구시 수성구 도서관", address: "대구시 수성구 동대구로 789", website: "https://library3.example.com" },
//     { id: 4, name: "인천시 연수구 도서관", address: "인천시 연수구 송도대로 101", website: "https://library4.example.com" },
//   ];

//   const [searchTerm, setSearchTerm] = useState("");

//   // 필터링
//   const filteredLibraries = libraries.filter((library) =>
//     library.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="main-page-container">
//       <Navbar />
//       <div className="search-lib-page">
//         {/* 검색 섹션 */}
//         <div className="search-section">
//           <input
//             type="text"
//             placeholder="도서관 이름 또는 주소를 입력하세요..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         {/* 검색 결과 */}
//         <div className="libraries-list">
//           {filteredLibraries.map((library) => (
//             <div key={library.id} className="library-item">
//               <h3>
//                 <Link to={`/libraries/${library.id}`}>{library.name}</Link>
//               </h3>
//               <p>{library.address}</p>
//               <a href={library.website} target="_blank" rel="noopener noreferrer">
//                 홈페이지
//               </a>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchLib;

import React, { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import { Link } from "react-router-dom";
import "./Page.css";

const SearchLib = () => {
  // Mock 데이터
  const libraries = [
    { id: 1, name: "서울시 강남구 도서관", address: "서울시 강남구 테헤란로 123", website: "https://library1.example.com" },
    { id: 2, name: "부산시 해운대구 도서관", address: "부산시 해운대구 센텀로 456", website: "https://library2.example.com" },
    { id: 3, name: "대구시 수성구 도서관", address: "대구시 수성구 동대구로 789", website: "https://library3.example.com" },
    { id: 4, name: "인천시 연수구 도서관", address: "인천시 연수구 송도대로 101", website: "https://library4.example.com" },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  // 필터링
  const filteredLibraries = libraries.filter((library) =>
    library.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-page-container">
      <Navbar />
      <div className="search-lib-page">
        {/* 검색 섹션 */}
        <div className="search-section">
          <input
            type="text"
            placeholder="도서관 이름 또는 주소를 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* 검색 결과 */}
        <div className="libraries-list">
          {filteredLibraries.map((library) => (
            <div key={library.id} className="library-item">
              <h3>
                <Link to={`/libraries/${library.id}`}>{library.name}</Link>
              </h3>
              <p>{library.address}</p>
              <a href={library.website} target="_blank" rel="noopener noreferrer">
                홈페이지
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchLib;
