import { useEffect,useState } from "react";
import "./SummaryCard.css";
import axios from "axios";
import api from "../Api/Api";

const SummaryCards = () => {

  const [summary, setSummary] = useState(null);

  const getSummary = async () => {
    try {
      const response = await api.get("/analytics/summary");
      if(response){
              console.log("response:",response.data.summary)

       setSummary(response.data.summary)
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      throw error;
    }
  };

  useEffect(()=>{
    getSummary();
    console.log(summary)
  },[])


  if (!summary) return <p>Loading...</p>;
    
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