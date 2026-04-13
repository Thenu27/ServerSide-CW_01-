import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./IndustrySectorChart.css";
import api from "../../Api/Api";
import { useEffect, useState } from "react";



const IndustrySectorChart = ({ data }) => {

  const [industryData,setIndustryData] = useState(null)

  const getIndustryData = async()=>{
    try{
      const response = await api.get('/analytics/industry');
      
      if(response){
        console.log(response.data.industryCount);
        setIndustryData(response.data.industryCount)
      }

    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getIndustryData()
  },[])


  const dummyData = [
    { name: "IT", value: 45 },
    { name: "Finance", value: 20 },
    { name: "Marketing", value: 15 },
    { name: "Education", value: 10 },
    { name: "Healthcare", value: 10 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;

  const COLORS = [
    "#4F46E5",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  return (
    <div className="industry-chart-card">
      <h3>Alumni by Industry Sector</h3>

      <div className="industry-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={industryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IndustrySectorChart;