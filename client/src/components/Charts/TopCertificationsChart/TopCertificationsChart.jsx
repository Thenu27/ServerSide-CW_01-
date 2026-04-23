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
import { useEffect, useState, useRef } from "react";
import api from "../../Api/Api";
import * as htmlToImage from "html-to-image";

const TopCertificationsChart = ({ data }) => {
  const [topCertifications, setTopCertifications] = useState([]);
  const chartRef = useRef();

  const getCertifications = async () => {
    try {
      const response = await api.get("/analytics/certification");

      if (response) {
        // console.log(response.data.topCertification);
        setTopCertifications(response.data.topCertification || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCertifications();
  }, []);

  const downloadChart = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current);

      const link = document.createElement("a");
      link.download = "top-certifications-chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log("Error downloading chart:", err);
    }
  };

  return (
    <div className="top-certifications-chart-card">
      <div className="chart-header">
        <h3>Top Certifications</h3>
        <button onClick={downloadChart} className="btn-download">
          Download Image
        </button>
      </div>

      <div className="top-certifications-chart-wrapper" ref={chartRef}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={topCertifications}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopCertificationsChart;