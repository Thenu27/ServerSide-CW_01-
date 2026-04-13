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
import "./ProgrammeChart.css";
import { useState,useEffect } from "react";
import api from '../../Api/Api'

const ProgrammeChart=({data})=>{

    const [degreeName,setDegreeName]=useState([])

    const getDegreeName = async(req,res,next)=>{
    try{
        const response = await api.get('/analytics/degreeName')
        if(response){
          console.log(response.data.degreeName)
          setDegreeName(response.data.degreeName)
        }
      
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getDegreeName()
  },[])


    return(
        <div className="programme-chart-card">
        <h3>Programme-wise Alumni Count</h3>

        <div className="programme-chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={degreeName} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={70}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
        </div>
    )
}

export default ProgrammeChart