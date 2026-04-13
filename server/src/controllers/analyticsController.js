const {AnalyticsService} = require('../services/analyticsService.js')

class AnalyticsController {

    constructor(){
       this.analyticsService = new AnalyticsService()
    }

   getSummary = async(req,res,next)=>{
    try{
        const summary = await this.analyticsService.summary();
        console.log("hit")
        res.status(200).json({
            summary,
            msg:"Summary Retrieved Succesfully"
        })
    }catch(err){
        next(err)
    }

   }    
}

module.exports = { AnalyticsController };