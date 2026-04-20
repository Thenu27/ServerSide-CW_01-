import GraduationYearChart from "../../components/Charts/GraduationYearChart/GraduationYearChart";
import IndustrySectorChart from "../../components/Charts/IndustrySectorChart/IndustrySectorChart";
import KeyInsightsChart from "../../components/Charts/KeyInsightsChart/KeyInsightsChart";
import TopEmployersChart from "../../components/Charts/TopEmployersChart/TopEmployersChart";
import ChartSection from "../../components/ChartSection/ChartSection";
import FiltersDashboard from "../../components/FiltersDashboard/FiltersDashboard";
import NavBar from "../../components/NavBar/NavBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import SummaryCards from "../../components/SummaryCard/SummaryCard";
import { useState } from "react";

const DashboardPage=()=>{
//     const stats = {
//         totalAlumni: 120,
//         topIndustry: "IT",
//         topEmployer: "Google",
//         topCertification: "AWS"
//     };

//     const [filters, setFilters] = useState({
//         programme: "",
//         graduationYear: "",
//         industrySector: "",
//     });

//     const handleApplyFilters = () => {
//         console.log("Applied filters:", filters);
//     };

//   const handleResetFilters = () => {
//     setFilters({
//       programme: "",
//       graduationYear: "",
//       industrySector: "",
//     });
//   };

    return(
        <div className="dashboard">
            <Sidebar/>
            {/* <NavBar/> */}
            <SummaryCards/>
            {/* <FiltersDashboard
                filters={filters}
                setFilters={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}                            
            /> */}
            {/* <ChartSection/> */}
            <div className="charts-section">
                <TopEmployersChart/>
                <GraduationYearChart/>
                <IndustrySectorChart/>
                <KeyInsightsChart/>
            </div>


        </div>
    )
}

export default DashboardPage