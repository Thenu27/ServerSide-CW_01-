import GraduationYearChart from "../Charts/GraduationYearChart/GraduationYearChart";
import IndustrySectorChart from "../Charts/IndustrySectorChart/IndustrySectorChart";
import "./ChartSection.css";

const ChartSection = () => {
  return (
    <div className="charts-section">
      <div className="chart-card">
        <h3>Alumni by Industry Sector</h3>
        {/* <div className="chart-placeholder">Pie / Doughnut Chart</div> */}
        <IndustrySectorChart/>
        <GraduationYearChart/>
      </div>

      <div className="chart-card">
        <h3>Alumni by Graduation Year</h3>
        <div className="chart-placeholder">Line / Bar Chart</div>
      </div>

      <div className="chart-card">
        <h3>Top Certifications</h3>
        <div className="chart-placeholder">Bar Chart</div>
      </div>

      <div className="chart-card">
        <h3>Top Professional Courses</h3>
        <div className="chart-placeholder">Bar Chart</div>
      </div>

      <div className="chart-card">
        <h3>Top Employers</h3>
        <div className="chart-placeholder">Bar Chart</div>
      </div>

      <div className="chart-card">
        <h3>Career Role Distribution</h3>
        <div className="chart-placeholder">Doughnut / Bar Chart</div>
      </div>

      <div className="chart-card">
        <h3>Skills Gap / Emerging Trends</h3>
        <div className="chart-placeholder">Line / Bar Chart</div>
      </div>

      <div className="chart-card">
        <h3>Programme-wise Alumni Count</h3>
        <div className="chart-placeholder">Bar Chart</div>
      </div>
    </div>
  );
};

export default ChartSection;