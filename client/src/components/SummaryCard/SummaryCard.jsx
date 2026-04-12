import "./SummaryCard.css";

const SummaryCards = ({ stats }) => {

    
  return (
    <div className="summary-cards-container">
      
      <div className="summary-card">
        <h3>Total Alumni</h3>
        <p>{stats.totalAlumni}</p>
      </div>

      <div className="summary-card">
        <h3>Top Industry</h3>
        <p>{stats.topIndustry}</p>
      </div>

      <div className="summary-card">
        <h3>Top Employer</h3>
        <p>{stats.topEmployer}</p>
      </div>

      <div className="summary-card">
        <h3>Top Certification</h3>
        <p>{stats.topCertification}</p>
      </div>

    </div>
  );
};

export default SummaryCards;