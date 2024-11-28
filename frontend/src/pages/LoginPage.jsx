import React, { useState } from "react";
import "./LoginPages.css";
import logoLarge from "../assets/logo-large.png";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const mockUsers = [
      { id: "test", password: "password" },
      { id: "user1", password: "1234" },
    ];

    const mockResponse = {
      success: mockUsers.some((user) => user.id === id.trim() && user.password === password),
      message: mockUsers.some((user) => user.id === id.trim() && user.password === password)
        ? "Login successful!"
        : "Invalid credentials",
    };

    if (mockResponse.success) {
      alert(mockResponse.message);
      window.location.href = "/main";
    } else {
      alert(mockResponse.message);
    }
  };

  return (
    <div className="page-container">
      {/* 로고와 Welcome 텍스트 */}
      <img src={logoLarge} alt="로고" class="logo"/>

      {/* 로그인 폼 */}
      <div className="container">
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="id">ID 입력</label>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="ID를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">PW 입력</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="button" type="submit">
            로그인
          </button>
        </form>
        <a href="/signup" className="link">
          회원가입
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
