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
import "./TopProfessionalCoursesChart.css";
import api from '../../Api/Api'
import { useEffect, useState } from "react";


const TopProfessionalCoursesChart = ({ data }) => {

  const [topCourses,setTopCourses] = useState([])
 
    const getTopCourses = async(req,res,next)=>{
       try{
          const response = await api.get('/analytics/courses')
      
          if(response){
            console.log(response.data.topCourses);
            setTopCourses(response.data.topCourses)
          }
      
     }catch(err){
        console.log(err)
      }
  }

  useEffect(()=>{
    getTopCourses()
  },[])

  return (
    <div className="top-professional-courses-chart-card">
      <h3>Top Professional Courses</h3>

      <div className="top-professional-courses-chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={topCourses}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={150}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProfessionalCoursesChart;