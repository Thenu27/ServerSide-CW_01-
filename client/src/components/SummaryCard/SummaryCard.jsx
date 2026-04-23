import { useEffect, useState } from "react";
import "./SummaryCard.css";
import api from "../Api/Api";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const SummaryCards = ({ summary: summaryProp }) => {
  const [summary, setSummary] = useState(summaryProp || null);

  const getSummary = async () => {
    try {
      const response = await api.get("/analytics/summary");
      if (response) {
        setSummary(response.data.summary);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate('/forbidden');
       }
      console.error("Error fetching summary:", error);
    }
  };

  useEffect(() => {
    if (summaryProp) {
      setSummary(summaryProp);
    } else {
      getSummary();
    }
  }, [summaryProp]);

  if (!summary) return <div><LoadingSpinner/></div>;

  return (
    <div className="summary-cards-container">
      <div className="summary-card">
        <h3>Total Alumni</h3>
        <p>{summary.totalAlumni}</p>
      </div>

      <div className="summary-card">
        <h3>Top Industry</h3>
        <p>{summary.topIndustry}</p>
      </div>

      <div className="summary-card">
        <h3>Top Employer</h3>
        <p>{summary.topEmployer}</p>
      </div>

      <div className="summary-card">
        <h3>Top Certification</h3>
        <p>{summary.topCertification}</p>
      </div>
    </div>
  );
};

export default SummaryCards;