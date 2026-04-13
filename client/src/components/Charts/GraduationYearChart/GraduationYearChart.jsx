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
import "./GraduationYearChart.css";
import api from '../../Api/Api'
import { useEffect, useState } from "react";

const GraduationYearChart = ({ data }) => {

  const [degreeYears,setDegreeYears] = useState([])

  const getDegreeYear = async(req,res,next)=>{
    try{
        const response = await api.get('/analytics/degree-year')
        if(response){
          console.log(response.data.degreeYear)
          setDegreeYears(response.data.degreeYear)
        }
      
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getDegreeYear()
  },[])


  return (
    <div className="graduation-chart-card">
      <h3>Alumni by Graduation Year</h3>

      <div className="graduation-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={degreeYears}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraduationYearChart;