import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./SkillsGapEmergingTrendsChart.css";
import api from "../../Api/Api";
import { useEffect, useState, useRef } from "react";
import * as htmlToImage from "html-to-image";

const SkillsGapEmergingTrendsChart = ({ data }) => {
  const [skillGaps, setSkillGaps] = useState([]);
  const chartRef = useRef();

  const getSkillGaps = async () => {
    try {
      const response = await api.get("/analytics/skill-gaps");
      if (response) {
        // console.log("skillgaps:", response.data.skillGaps);
        setSkillGaps(response.data.skillGaps || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSkillGaps();
  }, []);

  const downloadChart = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current);

      const link = document.createElement("a");
      link.download = "skills-gap-chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log("Error downloading chart:", err);
    }
  };

  return (
    <div className="skills-gap-chart-card">
      <div className="chart-header">
        <h3>Skills Gap / Emerging Trends</h3>
        <button onClick={downloadChart} className="btn-download">
          Download Image
        </button>
      </div>

      <div className="skills-gap-chart-wrapper" ref={chartRef}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={skillGaps}
            margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillsGapEmergingTrendsChart;