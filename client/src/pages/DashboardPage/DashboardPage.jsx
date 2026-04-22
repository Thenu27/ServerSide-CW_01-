import GraduationYearChart from "../../components/Charts/GraduationYearChart/GraduationYearChart";
import IndustrySectorChart from "../../components/Charts/IndustrySectorChart/IndustrySectorChart";
import KeyInsightsChart from "../../components/Charts/KeyInsightsChart/KeyInsightsChart";
import TopEmployersChart from "../../components/Charts/TopEmployersChart/TopEmployersChart";
import ChartSection from "../../components/ChartSection/ChartSection";
import FiltersDashboard from "../../components/FiltersDashboard/FiltersDashboard";
import NavBar from "../../components/NavBar/NavBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import SummaryCards from "../../components/SummaryCard/SummaryCard";
import { AuthContext } from "../../contexts/AuthContext";
import './DashboardPage.css'
import { useContext, useEffect, useState } from "react";

const DashboardPage = () => {


    const {accessToken,loading} = useContext(AuthContext)
    
    useEffect(()=>{
        if(loading || !accessToken){
            return "Loading..."
        }
    },[])

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>Alumni insights & analytics overview</p>
                </div>

                <SummaryCards />

                <div className="charts-section">
                    <TopEmployersChart />
                    <GraduationYearChart />
                    <IndustrySectorChart />
                    <KeyInsightsChart />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage