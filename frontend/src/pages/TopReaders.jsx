import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getTopReaders } from "../services/api"; // API 함수 임포트
const TopReaders = () => {
  const [data, setData] = useState([]); // 다독가 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const colors = ["#0088FE", "#00C49F", "#FFBB28"]; // 막대 색상
  useEffect(() => {
    const fetchTopReaders = async () => {
      try {
        const response = await getTopReaders(); // API 호출
        setData(response); // 데이터 상태 업데이트
      } catch (err) {
        console.error("API 요청 중 오류:", err);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopReaders();
  }, []);
  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  // 가장 많이 읽은 사용자와 책 권수 찾기
  const topReaderData = data.reduce((max, user) =>
    user.books_read_count > max.books_read_count ? user : max
  );
  const TopReader = topReaderData.user_id;
  const TopBookCounts = topReaderData.books_read_count;
  return (
    <div className="main-page-container">
      <h1 className="statistics-title">최고의 다독가 3인</h1>
      <div className="top-readers-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="user_id" />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="books_read_count" barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="top-reader-highlight">
          {TopBookCounts}권을 읽은 <strong>{TopReader}</strong> 님,<br />
          축하드립니다!
        </p>
      </div>
    </div>
  );
};
export default TopReaders;