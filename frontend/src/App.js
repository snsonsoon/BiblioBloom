import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";
import Reviews from "./pages/Reviews";
import ReviewPage from "./pages/ReviewPage";
import SearchBook from "./pages/SearchBook";
import BookPage from "./pages/BookPage";
import SearchLib from "./pages/SearchLib";
import LibraryPage from "./pages/LibraryPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/" element={<LoginPage />} />
        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<SignUpPage />} />
        {/* 메인 페이지 */}
        <Route path="/main" element={<MainPage />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reviews/:isbn/:user_id" element={<ReviewPage />} />
        <Route path="/search-book" element={<SearchBook />} />
        <Route path="/books/:id" element={<BookPage />} />
        <Route path="/search-lib" element={<SearchLib />} />
        <Route path="/libraries/:id" element={<LibraryPage />} />
      </Routes>
    </Router>
  );
}

export default App;