import GraduationYearChart from "../../components/Charts/GraduationYearChart/GraduationYearChart";
import IndustrySectorChart from "../../components/Charts/IndustrySectorChart/IndustrySectorChart";
import KeyInsightsChart from "../../components/Charts/KeyInsightsChart/KeyInsightsChart";
import TopEmployersChart from "../../components/Charts/TopEmployersChart/TopEmployersChart";
import ChartSection from "../../components/ChartSection/ChartSection";
import FiltersDashboard from "../../components/FiltersDashboard/FiltersDashboard";
import NavBar from "../../components/NavBar/NavBar";
import Sidebar from "../../components/Sidebar/Sidebar";
import SummaryCards from "../../components/SummaryCard/SummaryCard";
import './DashboardPage.css'
import { useState } from "react";

const DashboardPage = () => {
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