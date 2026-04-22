const { DegreeService } = require("../services/degreeService");

class DegreeController{
    constructor(){
        this.degreeService = new DegreeService()
    }

    addDegree = async(req,res,next)=>{

        try{
            const {degreeName,institution,year} = req.body;
            
            const userId = req.user.userId

            if (!degreeName || !institution || !year) {
            return res.status(400).json({
                status: "error",
                message: "All fields (degreeName, institution, year) are required",
            });
            }

            const degree = await this.degreeService.addDegree(userId,degreeName,institution,year)

            res.status(201).json({
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
                message: "Degrees retrieved successfully",
                degree
            })
        }catch(err){
            next(err)
        }
    }

    
    deleteDegree = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;

            const result = await this.degreeService.deleteDegree(userId, id);

            res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    };


    updateDegree = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { degreeName, institution, year } = req.body;
            
            if (!degreeName || !institution || !year) {
            return res.status(400).json({
                status: "error",
                message: "All fields (degreeName, institution, year) are required",
            });
            }

            const degree = await this.degreeService.updateDegree(
                userId,
                id,
                degreeName,
                institution,
                year
            );

            res.status(200).json({
                status: "success",
                message: "Degree updated successfully",
                degree
            });
        } catch (err) {
            next(err);
        }
    };


    

}

module.exports={DegreeController}