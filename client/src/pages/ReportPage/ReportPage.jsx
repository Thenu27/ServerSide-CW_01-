import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "../../components/Api/Api";
import "./ReportPage.css";
import { AuthContext } from "../../contexts/AuthContext";
import SummaryCards from "../../components/SummaryCard/SummaryCard";
import KeyInsightsChart from "../../components/Charts/KeyInsightsChart/KeyInsightsChart";
import DashboardAlumniPreview from "../../components/DashboardAlumniPreview/DashboardAlumniPreview";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const ReportPage = () => {
  const [skills, setSkills] = useState([]);
  const [certification, setCertification] = useState([]);
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState({
    topIndustry: "",
    mostCommonCertification: "",
    mostCommonEmployer: "",
    emergingSkill: "",
  });
   const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);

  const { loading, accessToken } = useContext(AuthContext);

  const reportRef = useRef();

  const getAllSkills = async () => {
    try {
      const response = await api.get("/analytics/skill-gaps");
      setSkills(response.data.skillGaps || []);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        navigate('/forbidden');
       }
      console.log(err);
    }
  };

  const getAllCertification = async () => {
    try {
      const response = await api.get("/certification/all");
      setCertification(response.data.allCert || []);
    } catch (err) {

      if (err.response && err.response.status === 403) {
        navigate('/forbidden');
       }

      console.log(err);
    }
  };

  const getSummary = async () => {
    try {
      const response = await api.get("/analytics/summary");
      setSummary(response.data.summary || null);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        navigate('/forbidden');
       }
      console.log(err);
    }
  };

  const getInsights = async () => {
    try {
      const response = await api.get("/key-insights");
      if (response?.data?.insights) {
        setInsights({
          topIndustry: response.data.insights.topIndustry || "",
          mostCommonCertification:
            response.data.insights.mostCommonCertification || "",
          mostCommonEmployer: response.data.insights.mostCommonEmployer || "",
          emergingSkill: response.data.insights.emergingSkill || "",
        });
      }
    } catch (err) {

      if (err.response && err.response.status === 403) {
        navigate('/forbidden');
       }      
      console.log(err);
    }
  };

  const getProfilePreview = async () => {
    try {
      const response = await api.get("/profile/view-alumni");
      const rawProfiles = response.data.profiles.profiles || [];

      const mappedProfiles = rawProfiles.map((profile) => ({
        id: profile.id,
        name: profile.fullName,
        programme: profile.degrees?.[0]?.degreeName || "N/A",
        gradYear: profile.degrees?.[0]?.year || "N/A",
        industry: profile.employmentHistory?.[0]?.industrySector || "N/A",
        role: profile.employmentHistory?.[0]?.jobTitle || "N/A",
      }));

      setAlumni(mappedProfiles.slice(0, 5));
    } catch (err) {
        if (err.response && err.response.status === 403) {
        navigate('/forbidden');
       }
      console.log(err);
    }
  };

  const handleExportCSV = () => {
    let csvContent = "";

    csvContent += "University Analytics Report\n";
    csvContent += `Generated on,${new Date().toLocaleDateString()}\n\n`;

    csvContent += "Summary Section\n";
    csvContent += "Metric,Value\n";
    csvContent += `Total Alumni,"${summary?.totalAlumni ?? "N/A"}"\n`;
    csvContent += `Top Industry,"${summary?.topIndustry ?? "N/A"}"\n`;
    csvContent += `Top Employer,"${summary?.topEmployer ?? "N/A"}"\n`;
    csvContent += `Top Certification,"${summary?.topCertification ?? "N/A"}"\n\n`;

    csvContent += "Top Skill Gaps Section\n";
    csvContent += "Skill,Count\n";
    skills.slice(0, 5).forEach((item) => {
      csvContent += `"${String(item.name).replace(/"/g, '""')}","${String(
        item.value
      ).replace(/"/g, '""')}"\n`;
    });
    csvContent += "\n";

    csvContent += "Top Certifications Section\n";
    csvContent += "Name,Count\n";
    certification.slice(0, 5).forEach((item) => {
      csvContent += `"${String(item.name).replace(/"/g, '""')}","${String(
        item._count?.name ?? 0
      ).replace(/"/g, '""')}"\n`;
    });
    csvContent += "\n";

    csvContent += "Key Insights Section\n";
    csvContent += "Insight,Value\n";
    csvContent += `Top Industry,"${String(insights.topIndustry || "N/A").replace(
      /"/g,
      '""'
    )}"\n`;
    csvContent += `Most Common Certification,"${String(
      insights.mostCommonCertification || "N/A"
    ).replace(/"/g, '""')}"\n`;
    csvContent += `Most Common Employer,"${String(
      insights.mostCommonEmployer || "N/A"
    ).replace(/"/g, '""')}"\n`;
    csvContent += `Emerging Skill,"${String(
      insights.emergingSkill || "N/A"
    ).replace(/"/g, '""')}"\n\n`;

    csvContent += "Alumni Preview Section\n";
    csvContent += "Full Name,Programme,Grad Year,Industry,Current Role\n";
    alumni.forEach((item) => {
      csvContent += `"${String(item.name).replace(/"/g, '""')}","${String(
        item.programme
      ).replace(/"/g, '""')}","${String(item.gradYear).replace(
        /"/g,
        '""'
      )}","${String(item.industry).replace(/"/g, '""')}","${String(
        item.role
      ).replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "university_analytics_report.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // higher = better quality
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width
      const pageHeight = 295; // A4 height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Extra pages if content is long
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("university_report.pdf");
    } catch (err) {
      console.log("PDF error:", err);
    }
  };


  useEffect(() => {
    if (!loading && accessToken) {
      getAllSkills();
      getAllCertification();
      getSummary();
      getInsights();
      getProfilePreview();
    }
  }, [loading, accessToken]);

  if (loading) return <div><LoadingSpinner/></div>

  return (
    <div ref={reportRef} className="report-page">
      <div className="report-header">
        <h1>University Analytics Report</h1>
        <p>Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="report-actions">
        <button onClick={handleExportCSV}>Export CSV</button>
        <button onClick={handleDownloadPDF}>Download / Print PDF</button>
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
                <td>{item._count?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <SummaryCards summary={summary} />
      <KeyInsightsChart insights={insights} />
      <DashboardAlumniPreview alumni={alumni} />
    </div>
  );
};

export default ReportPage;