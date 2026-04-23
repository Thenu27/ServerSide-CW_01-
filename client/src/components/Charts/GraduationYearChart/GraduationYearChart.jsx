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
import "./GraduationYearChart.css";
import api from "../../Api/Api";
import { useEffect, useState, useRef } from "react";
import * as htmlToImage from "html-to-image";

const GraduationYearChart = ({ data }) => {
  const [degreeYears, setDegreeYears] = useState([]);
  const chartRef = useRef();

  const getDegreeYear = async () => {
    try {
      const response = await api.get("/analytics/degree-year");
      if (response) {
        // console.log(response.data.degreeYear);
        setDegreeYears(response.data.degreeYear || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDegreeYear();
  }, []);

  const downloadChart = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current);

      const link = document.createElement("a");
      link.download = "graduation-year-chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log("Error downloading chart:", err);
    }
  };

  return (
    <div className="graduation-chart-card">
      <div className="chart-header">
        <h3>Alumni by Graduation Year</h3>
        <button onClick={downloadChart} className="btn-download">
          Download Image
        </button>
      </div>

      <div className="graduation-chart-wrapper" ref={chartRef}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={degreeYears}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraduationYearChart;