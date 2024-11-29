import React, { useState, useEffect } from "react";
import "./LoginPages.css";
import { signup } from "../services/api"; // API 함수 가져오기
const SignUpPage = () => {
  const [form, setForm] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });
  const [passwordMatchMessage, setPasswordMatchMessage] = useState(""); // 비밀번호 일치 확인 메시지
  const [error, setError] = useState(""); // 에러 메시지
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지
  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  // 비밀번호 일치 여부 확인
  useEffect(() => {
    if (form.password && form.confirmPassword) {
      if (form.password === form.confirmPassword) {
        setPasswordMatchMessage("PW가 일치합니다.");
      } else {
        setPasswordMatchMessage("PW가 일치하지 않습니다.");
      }
    } else {
      setPasswordMatchMessage("");
    }
  }, [form.password, form.confirmPassword]);
  // 회원가입 처리
  const handleSignUp = async (e) => {
    e.preventDefault();
    // 모든 조건 확인
    if (!form.id || !form.password || !form.confirmPassword || !form.nickname) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (passwordMatchMessage !== "PW가 일치합니다.") {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 회원가입 API 호출
    try {
      const response = await signup({
        user_id: form.id.trim(),
        password: form.password,
        nickname: form.nickname,
      });
      setSuccessMessage(response.message); // 성공 메시지 설정
      setError(""); // 에러 메시지 초기화
      window.location.href = "/"
    } catch (err) {
      setError(err.response?.data?.detail || "회원가입에 실패했습니다.");
      setSuccessMessage(""); // 성공 메시지 초기화
    }
  };
  return (
    <div className="page-container">
      <h1 className="welcome">WELCOME</h1>
      <div className="container">
        <form onSubmit={handleSignUp}>
          {/* ID 입력 */}
          <div className="input-group">
            <label htmlFor="id">ID 입력</label>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="ID를 입력하세요"
              value={form.id}
              onChange={handleChange}
            />
          </div>
          {/* 비밀번호 입력 */}
          <div className="input-group">
            <label htmlFor="password">PW 입력</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {/* 비밀번호 확인 */}
          <div className="input-group">
            <label htmlFor="password-confirm">PW 확인</label>
            <input
              type="password"
              id="password-confirm"
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <small
              style={{
                color: passwordMatchMessage === "PW가 일치합니다." ? "green" : "red",
              }}
            >
              {passwordMatchMessage}
            </small>
          </div>
          {/* 별명 입력 */}
          <div className="input-group">
            <label htmlFor="nickname">사용할 별명</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="별명을 입력하세요"
              value={form.nickname}
              onChange={handleChange}
            />
          </div>
          {/* 에러 메시지 */}
          {error && <p className="error-message">{error}</p>}
          {/* 성공 메시지 */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {/* 회원가입 버튼 */}
          <button className="button" type="submit">
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignUpPage;

// import React, { useState, useEffect } from "react";
// import "./LoginPages.css";

// const SignUpPage = () => {
//   const [form, setForm] = useState({
//     id: "",
//     password: "",
//     confirmPassword: "",
//     nickname: "",
//   });

//   // const [idCheckMessage, setIdCheckMessage] = useState(""); // ID 중복 확인 메시지
//   const [passwordMatchMessage, setPasswordMatchMessage] = useState(""); // 비밀번호 일치 확인 메시지

//   // Mock 데이터 (기존 회원 리스트)
//   // const mockUsers = [
//   //   { id: "test", password: "password" },
//   //   { id: "user1", password: "1234" },
//   // ];

  
//   // // ID 중복 확인
//   // const handleIdCheck = () => {
//   //   const isDuplicate = mockUsers.some((user) => user.id === form.id.trim());
//   //   if (isDuplicate) {
//   //     setIdCheckMessage("이미 사용 중인 ID입니다.");
//   //   } else {
//   //     setIdCheckMessage("사용 가능한 ID입니다.");
//   //   }
//   // };

//   // 입력 값 변경 핸들러
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // 비밀번호 일치 여부 확인 (useEffect로 상태 변경 시마다 실행)
//   useEffect(() => {
//     if (form.password && form.confirmPassword) {
//       if (form.password === form.confirmPassword) {
//         setPasswordMatchMessage("PW가 일치합니다.");
//       } else {
//         setPasswordMatchMessage("PW가 일치하지 않습니다.");
//       }
//     } else {
//       setPasswordMatchMessage("");
//     }
//   }, [form.password, form.confirmPassword]); // 비밀번호 상태 변경 시 실행

//   // 회원가입 처리
//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     // 모든 조건 확인
//     if (!form.id || !form.password || !form.confirmPassword || !form.nickname) {
//       alert("모든 항목을 입력해주세요.");
//       return;
//     }

//     // if (idCheckMessage !== "사용 가능한 ID입니다.") {
//     //   alert("ID 확인을 완료해주세요.");
//     //   return;
//     // }

//     if (passwordMatchMessage !== "PW가 일치합니다.") {
//       alert("비밀번호가 일치하지 않습니다.");
//       return;
//     }

//     // // 새로운 회원 추가 (Mock 데이터에 추가)
//     // mockUsers.push({
//     //   id: form.id.trim(),
//     //   password: form.password,
//     //   nickname: form.nickname,
//     // });
//     const userData = {
//       user_id: form.id.trim(),
//       password: form.password,
//       nickname: form.nickname,
//     };

//     try {
//       const response = await fetch('http://localhost:8000/api/user/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(userData)
//       });

//       if (response.ok) {
//         // const data = await response.json();
//         alert("회원가입이 완료되었습니다!");
//         window.location.href = "/"; // Redirect to login page on successful signup
//       } else {
//         throw new Error('Failed to sign up');
//       }
//     } catch (error) {
//       alert(`회원가입 실패: ${error.message}`);
//     }

//     // alert("회원가입이 완료되었습니다!");
//     // window.location.href = "/"; // 로그인 페이지로 이동
//   };

//   return (
//     <div className="page-container">
//       <h1 className="welcome">WELCOME</h1>
//       <div className="container">
//         <form onSubmit={handleSignUp}>
//           {/* ID 입력 */}
//           <div className="input-group">
//             <label htmlFor="id">ID 입력</label>
//             <input
//               type="text"
//               id="id"
//               name="id"
//               placeholder="ID를 입력하세요"
//               value={form.id}
//               onChange={handleChange}
//               // onBlur={handleIdCheck} // 포커스가 벗어날 때 ID 확인
//             />
//             {/* <small
//               style={{
//                 color: idCheckMessage === "사용 가능한 ID입니다." ? "green" : "red",
//               }}
//             >
//               {idCheckMessage}
//             </small> */}
//           </div>

//           {/* 비밀번호 입력 */}
//           <div className="input-group">
//             <label htmlFor="password">PW 입력</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="비밀번호를 입력하세요"
//               value={form.password}
//               onChange={handleChange}
//             />
//           </div>

//           {/* 비밀번호 확인 */}
//           <div className="input-group">
//             <label htmlFor="password-confirm">PW 확인</label>
//             <input
//               type="password"
//               id="password-confirm"
//               name="confirmPassword"
//               placeholder="비밀번호를 다시 입력하세요"
//               value={form.confirmPassword}
//               onChange={handleChange}
//             />
//             <small
//               style={{
//                 color: passwordMatchMessage === "PW가 일치합니다." ? "green" : "red",
//               }}
//             >
//               {passwordMatchMessage}
//             </small>
//           </div>

//           {/* 별명 입력 */}
//           <div className="input-group">
//             <label htmlFor="nickname">사용할 별명</label>
//             <input
//               type="text"
//               id="nickname"
//               name="nickname"
//               placeholder="별명을 입력하세요"
//               value={form.nickname}
//               onChange={handleChange}
//             />
//           </div>

//           {/* 회원가입 버튼 */}
//           <button className="button" type="submit">
//             시작하기
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;
