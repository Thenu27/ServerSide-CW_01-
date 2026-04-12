import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./CareerRoleDistributionChart.css";

const CareerRoleDistributionChart = ({ data }) => {
  const dummyData = [
    { name: "Software Engineer", value: 32 },
    { name: "Data Analyst", value: 18 },
    { name: "Project Manager", value: 12 },
    { name: "UI/UX Designer", value: 10 },
    { name: "Lecturer", value: 8 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];

  return (
    <div className="career-role-chart-card">
      <h3>Career Role Distribution</h3>

      <div className="career-role-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}   // 🔥 makes it doughnut
              outerRadius={100}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CareerRoleDistributionChart;