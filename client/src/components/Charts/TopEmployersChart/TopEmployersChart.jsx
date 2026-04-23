import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./TopEmployersChart.css";
import api from "../../Api/Api";
import { useEffect, useState, useRef } from "react";
import * as htmlToImage from "html-to-image";
import { useNavigate } from "react-router-dom";

const TopEmployersChart = ({ data }) => {
  const [topEmployers, setTopEmployers] = useState([]);
  const chartRef = useRef();

  const navigate = useNavigate();

  const getEmployers = async () => {
    try {
      const response = await api.get("/analytics/employer"); 

      if (response) {
        console.log(response.data.topEmployers);
        setTopEmployers(response.data.topEmployers || []);
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        navigate("/forbidden");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    getEmployers();
  }, []);

  const downloadChart = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current);

      const link = document.createElement("a");
      link.download = "top-employers-chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log("Error downloading chart:", err);
    }
  };

  return (
    <div className="top-employers-chart-card">
      <div className="chart-header">
        <h3>Top Employers</h3>
        <button onClick={downloadChart} className="btn-download">
          Download Image
        </button>
      </div>

      <div className="top-employers-chart-wrapper" ref={chartRef}>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius="80%" data={topEmployers}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar
              name="Employers"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopEmployersChart;