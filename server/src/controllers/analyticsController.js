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
        console.log('hit')
        res.status(200).json({
            industryCount,
            msg:"IndustryCount Retrieved Succesfully"
        })

    }catch(err){
        next(err)
    }
   }


}

module.exports = { AnalyticsController };