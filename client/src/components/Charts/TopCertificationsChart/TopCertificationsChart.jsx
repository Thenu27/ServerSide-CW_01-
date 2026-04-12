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
import "./TopCertificationsChart.css";

const TopCertificationsChart = ({ data }) => {
  const dummyData = [
    { certification: "AWS", count: 28 },
    { certification: "Scrum Master", count: 22 },
    { certification: "CCNA", count: 18 },
    { certification: "Azure", count: 15 },
    { certification: "Google Cloud", count: 10 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;

  return (
    <div className="top-certifications-chart-card">
      <h3>Top Certifications</h3>

      <div className="top-certifications-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="certification"
              type="category"
              width={120}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopCertificationsChart;