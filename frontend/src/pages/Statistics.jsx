import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getUserReviewStatistics, getGenreRatio } from "../services/api";
const Statistics = ({ userId: user_id }) => {
  const [reviewStats, setReviewStats] = useState(null); // 사용자 리뷰 통계
  const [genreData, setGenreData] = useState([]); // 장르 비율 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"]; // 그래프 색상
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = localStorage.getItem("user_id"); // localStorage에서 user_id 가져오기
        
        // 사용자 리뷰 통계 가져오기
        const userStats = await getUserReviewStatistics(user_id);
        setReviewStats(userStats); // reviewStats 상태 업데이트
        // 장르 비율 데이터 가져오기
        const genreStats = await getGenreRatio(user_id);
        const genreDataArray = Object.entries(genreStats.genre_ratio).map(([name, value]) => ({
          name, // 장르 이름
          value, // 비율 값
        }));
        setGenreData(genreDataArray); // genreData 상태 업데이트
      } catch (err) {
        console.error("API 요청 중 오류:", err);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // 빈 배열로 두어 컴포넌트 로드 시 한 번만 실행
  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!reviewStats) return <p>리뷰 통계를 찾을 수 없습니다.</p>;
  return (
    <div className="main-page-container">
    <h1 className="statistics-title">나의 독서 통계</h1>
    <div className="statistics-container">
      <div className="statistics-details">
        <h2>내가 읽은 책 권수</h2>
        <h1 className="book-count">{reviewStats.total_reviews}권</h1>
        <p>
          상위{" "}
          <span className="highlight">{reviewStats.percentile.toFixed(1)}%</span>
          입니다. 멋지네요!
        </p>
      </div>
      <hr className="divider"/>
      <div className="dna-section">
        <h2 className="dna-title">나의 책 DNA</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={genreData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
            >
              {genreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p>
          그래프 위에 마우스를 올려{" "}
          <br />
          어떤 분야의 책을 많이 읽었는지 확인해보세요.
        </p>
      </div>
    </div>
    </div>
  );
};
export default Statistics;

// import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import { getUserReviewStatistics, getGenreRatio } from "../services/api";
// const Statistics = ({ userId: user_id }) => {
//   const [reviewStats, setReviewStats] = useState(null); // 사용자 리뷰 통계
//   const [genreData, setGenreData] = useState([]); // 장르 비율 데이터
//   const [loading, setLoading] = useState(true); // 로딩 상태
//   const [error, setError] = useState(null); // 에러 상태
//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"]; // 그래프 색상

//   useEffect(() => {
//     const fetchStatisticsData = async () => {
//       try {
//         const user_id = localStorage.getItem("user_id"); // localStorage에서 user_id 가져오기
//         const genreStats = await getGenreRatio(user_id);
        
//         console.log("장르 데이터 응답:", genreStats); // 응답 데이터 확인
//         // genre_ratio 객체를 배열로 변환
//         const genreDataArray = Object.entries(genreStats.genre_ratio).map(([name, value]) => ({
//           name,  // 장르 이름
//           value, // 비율 값
//         }));
//         setGenreData(genreDataArray); // 상태에 저장
//       } catch (err) {
//         console.error("API 요청 중 오류:", err);
//         setError("데이터를 가져오는 중 오류가 발생했습니다.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStatisticsData();
//   }, [user_id]);
//   if (loading) return <p>로딩 중...</p>;
//   if (error) return <p>{error}</p>;
//   return (
//     <div className="statistics-container">
//       <div className="statistics-details">
//         <h2>내가 읽은 책 권수</h2>
//         <h1 className="book-count">{reviewStats.total_reviews}권</h1>
//         <p>
//           상위{" "}
//           <span className="highlight">{reviewStats.percentile.toFixed(1)}%</span>
//           입니다. 멋지네요!
//         </p>
//       </div>
//       <div className="dna-section">
//         <h2 className="dna-title">나의 책 DNA</h2>
//         <ResponsiveContainer width="100%" height={200}>
//           <PieChart>
//             <Pie
//               data={genreData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={80}
//               fill="#8884d8"
//               label
//             >
//               {genreData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//         <p>
//           그래프 위에 마우스를 올려{" "}
//           <br />
//           어떤 분야의 책을 많이 읽었는지 확인해보세요.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Statistics;

// import React from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const Statistics = () => {
//   // Mock data
//   const data = [
//     { name: "문학", value: 45 },
//     { name: "역사", value: 30 },
//     { name: "에세이", value: 25 },
//   ];

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]; // 색상 설정

//   const totalBooks = data.reduce((acc, item) => acc + item.value, 0);
//   const percentage = Math.round((totalBooks / 100) * 10); // 상위 n% 계산

//   return (
//     <div className="main-page-container">
//       <h1 className="statistics-title">나의 독서 통계</h1>
//     <div className="statistics-container">
//       <div className="statistics-details">
//         <h2>내가 읽은 책 권수</h2>
//         <h1 className="book-count">{totalBooks}권</h1>
//         <p>
//           상위 <span className="highlight">{percentage}%</span>입니다. 멋지네요!
//         </p>
//       </div>
//       {/* 구분선 */}
//       <hr className="divider" />
//       <div className="dna-section">
//         <h2 className="dna-title">나의 책 DNA</h2>
//         <ResponsiveContainer width="100%" height={200}>
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey="value"
//               cx="50%"
//               cy="50%"
//               outerRadius={80}
//               fill="#8884d8"
//             //   label
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//         <p>
//           그래프 위에 마우스를 올려 <br></br>
//           어떤 분야의 책을 많이 읽었는지<br></br>확인해보세요.
//         </p>
//       </div>
//     </div>
//     </div>
//   );
// };


