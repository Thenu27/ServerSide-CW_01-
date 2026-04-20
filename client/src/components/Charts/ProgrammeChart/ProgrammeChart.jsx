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
import { useState, useEffect, useRef } from "react";
import api from "../../Api/Api";
import * as htmlToImage from "html-to-image";

const ProgrammeChart = ({ data }) => {
  const [degreeName, setDegreeName] = useState([]);
  const chartRef = useRef();

  const getDegreeName = async () => {
    try {
      const response = await api.get("/analytics/degreeName");
      if (response) {
        console.log(response.data.degreeName);
        setDegreeName(response.data.degreeName || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDegreeName();
  }, []);

  const downloadChart = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current);

      const link = document.createElement("a");
      link.download = "programme-chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log("Error downloading chart:", err);
    }
  };

  return (
    <div className="programme-chart-card">
      <div className="chart-header">
        <h3>Programme-wise Alumni Count</h3>
        <button onClick={downloadChart} className="btn-download">
          Download Image
        </button>
      </div>

      <div className="programme-chart-wrapper" ref={chartRef}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={degreeName}
            margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={70}
            />
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

export default ProgrammeChart;