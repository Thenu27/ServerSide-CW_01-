const { prisma } = require("../config/prisma");
const { DegreeService } = require("../services/degreeService");

class DegreeController{
    constructor(){
        this.degreeService = new DegreeService()
    }

    addDegree = async(req,res,next)=>{
        console.log('hit')
        try{
            const {degreeName,institution,year} = req.body;
            const userId = req.user.userId
            const degree = await this.degreeService.addDegree(userId,degreeName,institution,year)

            res.status(200).json({
                status:"Success",
                message:"Degree added succesfully!",
                degree
            })
        }catch(err){
            next(err)
        }
    }

    getDegree = async(req,res,next)=>{
        try{
            const userId = req.user.userId;

            const degree = await this.degreeService.getDegree(userId);

            res.status(200).json({
                status : "Success",
                degree
            })
        }catch(err){
            next(err)
        }
    }


}

module.exports={DegreeController}