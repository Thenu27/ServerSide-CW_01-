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
import "./TopEmployersChart.css";

const TopEmployersChart = ({ data }) => {
  const dummyData = [
    { employer: "Google", count: 35 },
    { employer: "Microsoft", count: 30 },
    { employer: "Amazon", count: 25 },
    { employer: "Meta", count: 18 },
    { employer: "IBM", count: 12 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;

  return (
    <div className="top-employers-chart-card">
      <h3>Top Employers</h3>

      <div className="top-employers-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"   
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" />

            <YAxis
              dataKey="employer"
              type="category"
              width={120}
            />

            <Tooltip />
            <Legend />

            <Bar
              dataKey="count"
              fill="#3B82F6"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopEmployersChart;