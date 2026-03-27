const { LiscenceService } = require("../services/liscenceService");

class LiscenceController{

    constructor(){
        this.liscenceService = new LiscenceService()
    }

    addLiscence = async(req,res,next)=>{

        try{
            const {name,issuer,year} = req.body;
            const userId = req.user.userId;

            const liscence = await this.liscenceService.addLiscence(
                userId,name,issuer,year
            )

            res.status(200).json({
                status:"success",
                liscence
            })
        }catch(err){
            next(err)
        }

    }

    getLiscence = async(req,res,next)=>{
        try{
            const userId = req.user.userId;

            const liscence = await this.liscenceService.getLiscence(userId);

            res.status(200).json({
                status:"success",
                liscence
            })

        }catch(err){
            next(err)
        }
    }
}

module.exports={LiscenceController}