import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { deleteUser } from "../services/api"; // API 함수 가져오기
import "./DeleteAccount.css";
const DeleteAccount = () => {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/main"); // 메인 페이지로 이동
  };
  const handleConfirm = async () => {
    if (window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) {
      try {
        const user_id = localStorage.getItem("user_id"); // 현재 로그인된 사용자 ID 가져오기
        if (!user_id) {
          alert("로그인 상태가 아닙니다.");
          return;
        }
        await deleteUser(user_id); // API 호출
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.clear(); // 사용자 데이터 삭제
        navigate("/"); // 로그인 페이지로 이동
      } catch (err) {
        console.error(err);
        alert("회원 탈퇴 중 문제가 발생했습니다.");
      }
    }
  };
  return (
    <div className="delete-account-page">
      <Navbar />
      <div className="delete-account-container">
        <h1 className="delete-account-title">회원 탈퇴</h1>
        <p className="delete-account-warning">
          회원 탈퇴 시, 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          <br />
          정말 탈퇴하시겠습니까?
        </p>
        <div className="delete-account-buttons">
          <button className="cancel-button" onClick={handleCancel}>
            취소
          </button>
          <button className="confirm-button" onClick={handleConfirm}>
            탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteAccount;