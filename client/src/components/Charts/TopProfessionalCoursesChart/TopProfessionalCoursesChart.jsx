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
import "./TopProfessionalCoursesChart.css";

const TopProfessionalCoursesChart = ({ data }) => {
  const dummyData = [
    { course: "Python for Data Analysis", count: 24 },
    { course: "Docker Essentials", count: 19 },
    { course: "Agile Fundamentals", count: 17 },
    { course: "Tableau Basics", count: 13 },
    { course: "React Development", count: 11 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;

  return (
    <div className="top-professional-courses-chart-card">
      <h3>Top Professional Courses</h3>

      <div className="top-professional-courses-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="course"
              type="category"
              width={150}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3B82F6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProfessionalCoursesChart;