import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Statistics = () => {
  // Mock data
  const data = [
    { name: "문학", value: 45 },
    { name: "역사", value: 30 },
    { name: "에세이", value: 25 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]; // 색상 설정

  const totalBooks = data.reduce((acc, item) => acc + item.value, 0);
  const percentage = Math.round((totalBooks / 100) * 10); // 상위 n% 계산

  return (
    <div className="main-page-container">
      <h1 className="statistics-title">나의 독서 통계</h1>
    <div className="statistics-container">
      <div className="statistics-details">
        <h2>내가 읽은 책 권수</h2>
        <h1 className="book-count">{totalBooks}권</h1>
        <p>
          상위 <span className="highlight">{percentage}%</span>입니다. 멋지네요!
        </p>
      </div>
      {/* 구분선 */}
      <hr className="divider" />
      <div className="dna-section">
        <h2 className="dna-title">나의 책 DNA</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
            //   label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p>
          그래프 위에 마우스를 올려 <br></br>
          어떤 분야의 책을 많이 읽었는지 확인해보세요.
        </p>
      </div>
    </div>
    </div>
  );
};

export default Statistics;
