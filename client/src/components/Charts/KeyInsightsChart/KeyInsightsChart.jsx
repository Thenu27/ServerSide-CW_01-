import { useEffect, useState, useRef } from "react";
import "./KeyInsightsChart.css";
import api from "../../Api/Api";
import * as htmlToImage from "html-to-image";

const KeyInsightsChart = () => {
  const [insights, setInsights] = useState({
    topIndustry: "",
    mostCommonCertification: "",
    mostCommonEmployer: "",
    emergingSkill: "",
  });

  const cardRef = useRef();

  const getInsights = async () => {
    try {
      const response = await api.get("/key-insights");

      if (response) {
        console.log(response.data.insights);
        setInsights({
          topIndustry: response.data.insights.topIndustry,
          mostCommonCertification: response.data.insights.mostCommonCertification,
          mostCommonEmployer: response.data.insights.mostCommonEmployer,
          emergingSkill: response.data.insights.emergingSkill,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getInsights();
  }, []);

  const downloadInsights = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current);

      const link = document.createElement("a");
      link.download = "key-insights.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.log("Error downloading insights:", err);
    }
  };

  return (
    <div className="key-insights-card">
      <div className="chart-header">
        <h3>Key Insights</h3>
        <button onClick={downloadInsights} className="btn-download">
          Download Image
        </button>
      </div>

      {/* 👇 wrap content in ref */}
      <div className="key-insights-grid" ref={cardRef}>
        <div className="insight-box">
          <p className="insight-label">Top Industry</p>
          <h4 className="insight-value">{insights.topIndustry || "N/A"}</h4>
        </div>

        <div className="insight-box">
          <p className="insight-label">Most Common Certification</p>
          <h4 className="insight-value">
            {insights.mostCommonCertification || "N/A"}
          </h4>
        </div>

        <div className="insight-box">
          <p className="insight-label">Most Common Employer</p>
          <h4 className="insight-value">
            {insights.mostCommonEmployer || "N/A"}
          </h4>
        </div>

        <div className="insight-box">
          <p className="insight-label">Emerging Skill</p>
          <h4 className="insight-value">
            {insights.emergingSkill || "N/A"}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default KeyInsightsChart;