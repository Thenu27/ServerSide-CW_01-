const { prisma } = require("../config/prisma")

class EmploymentService{
    addEmployment = async(userId,companyName,jobTitle,startDate,endDate,description)=>{
      const profile = await prisma.profile.findUnique({
        where:{userId}
      }) 

    if(!profile){
        const error = new Error("Profile not found!");
        error.statusCode = 404;
        throw error
      }

    const employment = await prisma.employmentHistory.create({
        data:{
            profileId : profile.id,
            companyName,
            jobTitle,
            startDate:new Date(startDate),
            endDate:endDate ? new Date(endDate) : null,
            description
        }
    }) 

    return employment

    }
}

module.exports={EmploymentService}