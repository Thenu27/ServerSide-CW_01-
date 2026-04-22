const { EmploymentService } = require("../services/employmentService")

class EmploymentController{
    constructor(){
        this.employmentService = new EmploymentService();
    }

    addEmployment = async(req,res,next)=>{
        console.log('employment hit')
        try{
            const {companyName, jobTitle, startDate, endDate, description,industrySector} = req.body
            const userId = req.user.userId

            if (!companyName || !jobTitle) {
            return res.status(400).json({
                status: "error",
                message: "All fields (companyName, jobTitle) are required",
            });
            }           
            const employment = await this.employmentService.addEmployment(
                userId,companyName, jobTitle, startDate, endDate, description, industrySector
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


    getEmployment = async(req,res,next)=>{
        try{
            const userId = req.user.userId;
            const employment = await this.employmentService.getEmployment(userId);

            res.status(200).json({
                status:"Success",
                message: "Employment history retrieved successfully",
                employment
            })
        }catch(err){
            next(err)
        }
    }

    deleteEmployment = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { id } = req.params;

                const result = await this.employmentService.deleteEmployment(userId, id);

                res.status(200).json({
                    status: "success",
                    message: result.message
                });
            } catch (err) {
                next(err);
            }
        };


        updateEmployment = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { id } = req.params;
                const { companyName, jobTitle, startDate, endDate, description } = req.body;
                
                if (!companyName || !jobTitle) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (companyName, jobTitle) are required",
                });
                }
                const employment = await this.employmentService.updateEmployment(
                    userId,
                    id,
                    companyName,
                    jobTitle,
                    startDate,
                    endDate,
                    description
                );

                res.status(200).json({
                    status: "success",
                    message: "Employment history updated successfully",
                    employment
                });
            } catch (err) {
                next(err);
            }
        };



}

module.exports = {EmploymentController}