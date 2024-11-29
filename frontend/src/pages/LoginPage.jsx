import React, { useState } from "react";
import "./LoginPages.css";
import logoLarge from "../assets/logo-large.png";
import { login } from "../services/api"; // API 함수 가져오기
const LoginPage = () => {
  const [user_id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    // 로그인 API 호출
    try {
      const response = await login({ user_id: user_id.trim(), password });
      alert(response.access_token ? "로그인 성공!" : "로그인 실패");
      localStorage.setItem("user_id", user_id.trim()); // user_id를 localStorage에 저장
      setError(""); // 에러 초기화
      window.location.href = "/main"; // 메인 페이지로 이동
    } catch (err) {
      setError(err.response?.data?.detail || "로그인 실패. 다시 시도해주세요.");
    }
  };
  return (
    <div className="page-container">
      {/* 로고와 Welcome 텍스트 */}
      <img src={logoLarge} alt="로고" className="logo" />
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
              value={user_id}
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
          {error && <p className="error-message">{error}</p>} {/* 에러 메시지 표시 */}
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

// import React, { useState } from "react";
// import "./LoginPages.css";
// import logoLarge from "../assets/logo-large.png";

// const LoginPage = () => {
//   const [id, setId] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     const mockUsers = [
//       { id: "test", password: "password" },
//       { id: "user1", password: "1234" },
//     ];

//     const mockResponse = {
//       success: mockUsers.some((user) => user.id === id.trim() && user.password === password),
//       message: mockUsers.some((user) => user.id === id.trim() && user.password === password)
//         ? "Login successful!"
//         : "Invalid credentials",
//     };

//     if (mockResponse.success) {
//       alert(mockResponse.message);
//       window.location.href = "/main";
//     } else {
//       alert(mockResponse.message);
//     }
//   };

//   return (
//     <div className="page-container">
//       {/* 로고와 Welcome 텍스트 */}
//       <img src={logoLarge} alt="로고" class="logo"/>

//       {/* 로그인 폼 */}
//       <div className="container">
//         <form onSubmit={handleLogin}>
//           <div className="input-group">
//             <label htmlFor="id">ID 입력</label>
//             <input
//               type="text"
//               id="id"
//               name="id"
//               placeholder="ID를 입력하세요"
//               value={id}
//               onChange={(e) => setId(e.target.value)}
//             />
//           </div>
//           <div className="input-group">
//             <label htmlFor="password">PW 입력</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="비밀번호를 입력하세요"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <button className="button" type="submit">
//             로그인
//           </button>
//         </form>
//         <a href="/signup" className="link">
//           회원가입
//         </a>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
