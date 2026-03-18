const e = require("express");
const { CertificationService } = require("../services/certificationService")

class CertificationController{
    constructor(){
        this.certificationService = new CertificationService()
    }

    addCertification = async(req,res,next)=>{
        try{
            const {name,issuer,year} = req.body;
            const userId = req.user.userId;

            const certification = await this.certificationService.addCertification(userId,name,issuer,year)

            res.status(200).json({
                status:"success",
                certification
            })

        }catch(err){
            next(err)
        }



    }

    getCertification = async(req,res,next)=>{
        try{
            const userId = req.user.userId;

            const certification = await this.certificationService.getCertification(userId);

            res.status(200).json({
                status:"success",
                certification
            })


        }catch(err){
            next(err)
        }
    }
}

module.exports={CertificationController}