import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // 스타일 파일 연결
const Footer = () => {
  return (
    <footer className="footer">
        <p className="copyright">© 2024 BiblioBloom</p>
        <Link to="/delete-account" className="delete-button">회원 탈퇴</Link>
    </footer>
  );
};
export default Footer;