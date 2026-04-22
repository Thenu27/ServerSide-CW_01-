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
      if(err.status === 403){
        navigate('/forbidden')
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
          <BarChart
            data={topEmployers}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
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