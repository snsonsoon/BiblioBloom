import React from "react";
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

const TopReaders = () => {
  const data = [
    { name: "사용자1", books: 20 },
    { name: "사용자2", books: 14 },
    { name: "사용자3", books: 12 },
  ];

  // 가장 많이 읽은 사용자와 책 권수 찾기
  const topReaderData = data.reduce((max, user) =>
    user.books > max.books ? user : max
  );
  const TopReader = topReaderData.name;
  const TopBookCounts = topReaderData.books;

  const colors = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="main-page-container">
    <h1 className="statistics-title">최고의 다독가 3인</h1>
    <div className="top-readers-container">
      <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis hide/>
        <Tooltip />
        <Bar dataKey="books" barSize={40}> {/* barSize로 너비 설정 */}
            {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
        </Bar> 
        </BarChart>
      </ResponsiveContainer>
      <p className="top-reader-highlight">
        {TopBookCounts}권을 읽은 <strong>{TopReader}</strong>님, 축하드립니다!
      </p>
    </div>
    </div>
  );
};

export default TopReaders;
