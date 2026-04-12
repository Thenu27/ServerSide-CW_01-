import ChartSection from "../../components/ChartSection/ChartSection";
import FiltersDashboard from "../../components/FiltersDashboard/FiltersDashboard";
import SummaryCards from "../../components/SummaryCard/SummaryCard";
import { useState } from "react";

const DashboardPage=()=>{
    const stats = {
        totalAlumni: 120,
        topIndustry: "IT",
        topEmployer: "Google",
        topCertification: "AWS"
    };

    const [filters, setFilters] = useState({
        programme: "",
        graduationYear: "",
        industrySector: "",
    });

    const handleApplyFilters = () => {
        console.log("Applied filters:", filters);
    };

  const handleResetFilters = () => {
    setFilters({
      programme: "",
      graduationYear: "",
      industrySector: "",
    });
  };

    return(
        <div className="dashboard">
            <SummaryCards stats={stats}/>
            <FiltersDashboard
                filters={filters}
                setFilters={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}                            
            />
            <ChartSection/>
        </div>
    )
}

export default DashboardPage