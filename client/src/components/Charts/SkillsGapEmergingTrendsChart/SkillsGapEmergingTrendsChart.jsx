import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./SkillsGapEmergingTrendsChart.css";
import api from '../../Api/Api'
import { useEffect } from "react";
import { useState } from "react";

const SkillsGapEmergingTrendsChart = ({ data }) => {
  const dummyData = [
    { skill: "Docker", count: 26 },
    { skill: "AWS", count: 22 },
    { skill: "Kubernetes", count: 18 },
    { skill: "Tableau", count: 14 },
    { skill: "Scrum", count: 12 },
  ];

  const chartData = data && data.length > 0 ? data : dummyData;

  const [skillGaps,setSkillGaps] = useState([]);

  const getSkillGaps = async()=>{
    try{
      const response = await api.get('/analytics/skill-gaps')
      if(response){
        console.log("skillgaps:",response.data.skillGaps);
        setSkillGaps(response.data.skillGaps)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getSkillGaps()
  },[])

  return (
    <div className="skills-gap-chart-card">
      <h3>Skills Gap / Emerging Trends</h3>

      <div className="skills-gap-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={skillGaps}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={140}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#10B981" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillsGapEmergingTrendsChart;