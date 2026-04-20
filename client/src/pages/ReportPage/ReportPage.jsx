import { useContext, useEffect, useState } from "react";
import api from "../../components/Api/Api";
import "./ReportPage.css";
import { AuthContext } from "../../contexts/AuthContext";
import SummaryCards from "../../components/SummaryCard/SummaryCard";
import KeyInsightsChart from "../../components/Charts/KeyInsightsChart/KeyInsightsChart";
import DashboardAlumniPreview from "../../components/DashboardAlumniPreview/DashboardAlumniPreview";

const ReportPage = () => {
  const [skills, setSkills] = useState([]);
  const [certification, setCertification] = useState([]);
  const { loading, accessToken } = useContext(AuthContext);

  const getAllSkills = async () => {
    try {
      const response = await api.get("/analytics/skill-gaps");
      if (response) {
        console.log(response.data.skillGaps);
      }
      setSkills(response.data.skillGaps || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllCertification = async () => {
    try {
      const response = await api.get("/certification/all");
      if (response) {
        console.log("Certification:", response);
        setCertification(response.data.allCert);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!loading && accessToken) {
      getAllSkills();
      getAllCertification();
    }
  }, [loading, accessToken]);

  if (loading) return "Loading...";

  return (
    <div className="report-page">
      <div className="report-header">
        <h1>University Analytics Report</h1>
        <p>Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="report-actions">
        <button>Export CSV</button>
        <button>Download / Print PDF</button>
      </div>

      <section className="report-section">
        <h2>Top Skill Gaps</h2>
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {skills.slice(0, 5).map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="report-section">
        <h2>Top Certifications</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {certification.slice(0, 5).map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item._count.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <SummaryCards />
      <KeyInsightsChart />
      <DashboardAlumniPreview/>
    </div>
  );
};

export default ReportPage;