import AlumniPreviewSection from "../AlumniPreviewSection/AlumniPreviewSection";
import CareerRoleDistributionChart from "../Charts/CareerRoleDistributionChart/CareerRoleDistributionChart";
import GraduationYearChart from "../Charts/GraduationYearChart/GraduationYearChart";
import IndustrySectorChart from "../Charts/IndustrySectorChart/IndustrySectorChart";
import ProgrammeChart from "../Charts/ProgrammeChart/ProgrammeChart";
import SkillsGapEmergingTrendsChart from "../Charts/SkillsGapEmergingTrendsChart/SkillsGapEmergingTrendsChart";
import TopCertificationsChart from "../Charts/TopCertificationsChart/TopCertificationsChart";
import TopEmployersChart from "../Charts/TopEmployersChart/TopEmployersChart";
import TopProfessionalCoursesChart from "../Charts/TopProfessionalCoursesChart/TopProfessionalCoursesChart";
import ExportReportSection from "../ExportReportSection/ExportReportSection";
import InsightsPanel from "../InsightsPanel/InsightsPanel";
import Sidebar from "../Sidebar/Sidebar";
import "./ChartSection.css";

const ChartSection = () => {
  return (
    <div className="charts-section">
        <IndustrySectorChart/>
        <GraduationYearChart/>
        <ProgrammeChart/>
        <TopCertificationsChart/>
        <TopEmployersChart/>
        <CareerRoleDistributionChart/>
        <TopProfessionalCoursesChart/>
        <SkillsGapEmergingTrendsChart/>

        <ExportReportSection/>
        <AlumniPreviewSection/>
        <InsightsPanel/>
        <Sidebar/>
    </div>
  );
};

export default ChartSection;