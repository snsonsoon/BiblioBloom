import React from "react";
import { Link } from "react-router-dom";
import logoSmall from "../../assets/logo-small.png";
import "./Navbar.css"; // 별도의 스타일 파일

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logoSmall} alt="로고" className="nav-logo-image" />
      <ul className="nav-links">
        <li><Link to="/main">Home</Link></li>
        <li><Link to="/reviews">서평 모음</Link></li>
        <li><Link to="/search-book">도서 검색</Link></li>
        <li><Link to="/search-lib">도서관 검색</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
