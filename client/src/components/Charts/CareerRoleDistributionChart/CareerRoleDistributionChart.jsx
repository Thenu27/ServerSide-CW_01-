import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./CareerRoleDistributionChart.css";
import api from '../../Api/Api'
import { useEffect,useState } from "react";

const CareerRoleDistributionChart = ({ data }) => {


  const [careerNames,setCareerNames] = useState([]);

  const getCareer = async(req,res,next)=>{

    try{
      const response = await api.get('/analytics/job-title')

      if(response){
        console.log(response)
        setCareerNames(response.data.jobTitle)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getCareer()
  },[])

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];

  return (
    <div className="career-role-chart-card">
      <h3>Career Role Distribution</h3>

      <div className="career-role-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={careerNames}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}   // 🔥 makes it doughnut
              outerRadius={100}
              paddingAngle={3}
            >
              {careerNames.map((entry, index) => (
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

export default CareerRoleDistributionChart;