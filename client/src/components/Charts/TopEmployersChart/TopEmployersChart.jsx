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


import "./TopEmployersChart.css";
import api from '../../Api/Api'
import { useEffect, useState } from "react";

const TopEmployersChart = ({ data }) => {

  const [topEmployers,setTopEmployers] = useState([])

  const getEmployers=async()=>{
    try{
      const response = await api.get('analytics/employer');

      if(response){
        console.log(response.data.topEmployers)
        setTopEmployers(response.data.topEmployers)
      }
        
    }catch(err){
      console.log(err)
    }

  }

  useEffect(()=>{
    getEmployers()
  },[])

  return (
    <div className="top-employers-chart-card">
      <h3>Top Employers</h3>

      <div className="top-employers-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={topEmployers}
            layout="vertical"   
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" />

            <YAxis
              dataKey="name"
              type="category"
              width={120}
            />

            <Tooltip />
            <Legend />

            <Bar
              dataKey="value"
              fill="#3B82F6"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopEmployersChart;