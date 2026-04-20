import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./CareerRoleDistributionChart.css";
import api from "../../Api/Api";
import { useEffect, useState, useRef } from "react";
import * as htmlToImage from "html-to-image";

const CareerRoleDistributionChart = ({ data }) => {
  const [careerNames, setCareerNames] = useState([]);
  const chartRef = useRef();

  const getCareer = async () => {
    try {
      const response = await api.get("/analytics/job-title");

      if (response) {
        console.log(response.data.jobTitle);
        setCareerNames(response.data.jobTitle || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCareer();
  }, []);

  const downloadChart = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current);

      const link = document.createElement("a");
      link.download = "career-role-chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log("Error downloading chart:", err);
    }
  };

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];

  return (
    <div className="career-role-chart-card">
      <div className="chart-header">
        <h3>Career Role Distribution</h3>
        <button onClick={downloadChart} className="btn-download">
          Download Image
        </button>
      </div>

      <div className="career-role-chart-wrapper" ref={chartRef}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={careerNames}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {careerNames.map((entry, index) => (
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