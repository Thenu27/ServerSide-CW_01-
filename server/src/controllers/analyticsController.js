const {AnalyticsService} = require('../services/analyticsService.js')

class AnalyticsController {

    constructor(){
       this.analyticsService = new AnalyticsService()
    }

   getSummary = async(req,res,next)=>{
    try{
        const summary = await this.analyticsService.summary();
        res.status(200).json({
            summary,
            msg:"Summary Retrieved Succesfully"
        })
    }catch(err){
        next(err)
    }

   }    

   getIndustryCount = async(req,res,next)=>{
    try{
        const industryCount = await this.analyticsService.getIndustryCount();
        res.status(200).json({
            industryCount,
            msg:"IndustryCount Retrieved Succesfully"
        })

    }catch(err){
        next(err)
    }
   }


   getTopCertification = async(req,res,next)=>{
    try{
        const topCertification = await this.analyticsService.getTopCertification();
        console.log('Certificationhit')
        res.status(200).json({
            topCertification,
            msg:"topCertification Retrieved Succesfully"
        })

    }catch(err){
        next(err)
    }
   }


   getTopEmployers = async(req,res,next)=>{
    try{
        const topEmployers = await this.analyticsService.getTopEmployers();
        console.log('Employers hit')
        res.status(200).json({
            topEmployers,
            msg:"topEmployers Retrieved Succesfully"
        })

    }catch(err){
        next(err)
    }
   }   


   getTopCourses = async(req,res,next)=>{
    try{
        const topCourses = await this.analyticsService.getTopCourses();
        res.status(200).json({
            topCourses,
            msg:"topCourses Retrieved Succesfully"
        })

    }catch(err){
        next(err)
    }
   }  

   getDegreeYear = async(req,res,next)=>{
    try{
        const degreeYear = await this.analyticsService.getGraduateYear();
        console.log("degreeYear:",degreeYear)
        res.status(200).json({
            degreeYear,
            msg:"degreeYear Retrieved Succesfully"
        })

    }catch(err){
        next(err)
    }
   }     


   getDegreeName = async(req,res,next)=>{
    try{
        const degreeName = await this.analyticsService.getDegree();
        res.status(200).json({
            degreeName,
            msg:"degreeName Retrieved Succesfully"
        })

    }catch(err){
        next(err)
    }
   }  

   getJobTitle = async(req,res,next)=>{
    try{
        const jobTitle = await this.analyticsService.getCareer();
        res.status(200).json({
            jobTitle,
            msg:"jobTitle Retrieved Succesfully"
        })

    }catch(err){
        next(err)
    }
   }  
}

module.exports = { AnalyticsController };