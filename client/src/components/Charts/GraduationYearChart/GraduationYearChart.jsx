import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./GraduationYearChart.css";

const GraduationYearChart = ({ data }) => {
  const dummyData = [
    { year: "2021", alumni: 18 },
    { year: "2022", alumni: 28 },
    { year: "2023", alumni: 35 },
    { year: "2024", alumni: 24 },
    { year: "2025", alumni: 15 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;

  return (
    <div className="graduation-chart-card">
      <h3>Alumni by Graduation Year</h3>

      <div className="graduation-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="alumni" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraduationYearChart;