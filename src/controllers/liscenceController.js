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

            res.status(201).json({
                status:"success",
                message: "Licence added successfully",
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
                message: "Licences retrieved successfully",
                liscence
            })

        }catch(err){
            next(err)
        }
    }

    deleteLiscence = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const result = await this.liscenceService.deleteLiscence(userId, id);

            res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    };

    updateLiscence = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { name, issuer, year } = req.body;

            const liscence = await this.liscenceService.updateLiscence(
                userId,
                id,
                name,
                issuer,
                year
            );

            res.status(200).json({
                status: "success",
                message: "Licence updated successfully",
                liscence
            });
        } catch (err) {
            next(err);
        }
    };


}

module.exports={LiscenceController}