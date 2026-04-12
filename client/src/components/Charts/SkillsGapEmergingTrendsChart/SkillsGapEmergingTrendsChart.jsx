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
import "./SkillsGapEmergingTrendsChart.css";

const SkillsGapEmergingTrendsChart = ({ data }) => {
  const dummyData = [
    { skill: "Docker", count: 26 },
    { skill: "AWS", count: 22 },
    { skill: "Kubernetes", count: 18 },
    { skill: "Tableau", count: 14 },
    { skill: "Scrum", count: 12 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;

  return (
    <div className="skills-gap-chart-card">
      <h3>Skills Gap / Emerging Trends</h3>

      <div className="skills-gap-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="skill"
              type="category"
              width={140}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillsGapEmergingTrendsChart;