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
import "./ProgrammeChart.css";

const ProgrammeChart=({data})=>{
      const dummyData = [
    { programme: "Computer Science", alumni: 40 },
    { programme: "Software Engineering", alumni: 30 },
    { programme: "Business Management", alumni: 22 },
    { programme: "Cyber Security", alumni: 18 },
    { programme: "Data Science", alumni: 14 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;
    return(
        <div className="programme-chart-card">
        <h3>Programme-wise Alumni Count</h3>

        <div className="programme-chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="programme"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={70}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="alumni" radius={[8, 8, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
        </div>
    )
}

export default ProgrammeChart