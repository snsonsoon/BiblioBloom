import React from "react";
import Statistics from "./Statistics";
import TopReaders from "./TopReaders";
import RecommendedBooks from "./RecommendedBooks";
import "./Page.css";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const MainPage = () => {
  return (
    <div className="main-page-container">
      {/* 네비게이션 바 */}
      <Navbar />
      {/* 콘텐츠 섹션 */}
      <div className="content-wrapper-horizontal">
        <Statistics />
        <TopReaders />
        <RecommendedBooks />
      </div>
      <Footer/>
    </div>
  );
};

export default MainPage;
