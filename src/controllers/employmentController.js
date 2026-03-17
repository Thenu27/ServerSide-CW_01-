const { EmploymentService } = require("../services/employmentService")

class EmploymentController{
    constructor(){
        this.employmentService = new EmploymentService();
    }

    addEmployment = async(req,res,next)=>{
        console.log('hit')
        try{
            const {companyName, jobTitle, startDate, endDate, description} = req.body
            const userId = req.user.userId
            const employment = await this.employmentService.addEmployment(
                userId,companyName, jobTitle, startDate, endDate, description
            )

            res.status(201).json({
                status:"Success",
                message:"Employment history added successfully",
                employment
            })

        }catch(err){
            next(err)
        }
    }
}

module.exports = {EmploymentController}