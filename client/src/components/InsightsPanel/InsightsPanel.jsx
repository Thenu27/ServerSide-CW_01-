import "./InsightsPanel.css";

const InsightsPanel = ({ insights }) => {
  const dummyInsights = {
    topIndustry: "IT",
    topCertification: "AWS",
    topEmployer: "Google",
    emergingSkill: "Docker",
  };

  const data = insights || dummyInsights;

  return (
    <div className="insights-panel-card">
      <h3>Key Insights</h3>

      <div className="insights-list">
        <div className="insight-item">
          <span className="label">Top Industry</span>
          <span className="value">{data.topIndustry}</span>
        </div>

        <div className="insight-item">
          <span className="label">Most Common Certification</span>
          <span className="value">{data.topCertification}</span>
        </div>

        <div className="insight-item">
          <span className="label">Most Common Employer</span>
          <span className="value">{data.topEmployer}</span>
        </div>

        <div className="insight-item">
          <span className="label">Emerging Skill</span>
          <span className="value">{data.emergingSkill}</span>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;