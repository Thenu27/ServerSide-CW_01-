const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

class EmploymentService{

    constructor(){
      this.usageService = new UsageService()
    }

    addEmployment = async(userId,companyName,jobTitle,startDate,endDate,description,industrySector)=>{

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
            startDate:startDate,
            endDate:endDate ? new Date(endDate) : null,
            description,
            industrySector
        }
    }) 

    if(userId){
        await this.usageService.usage({
          userId : userId,
          action:"ADD_EMPLOYMENT",
          endpoint : "/employment",
          method : "POST"
       })
    }  


    return employment

    }

    getEmployment = async(userId)=>{

      const profile = await prisma.profile.findUnique({
        where:{userId}
      })

      if(!profile){
          const error = new Error("Profile not found!");
          error.statusCode = 404;
          throw error
      }

      const employment = await prisma.employmentHistory.findMany({
        where:{profileId:profile.id},
        orderBy : {createdAt : 'desc'}

      })

      if(!employment || employment.length === 0){
         const error = new Error("Employment history not found!");
         error.statusCode = 404;
         throw error
      }


      if(userId){
          await this.usageService.usage({
            userId : userId,
            action:"GET_EMPLOYMENT",
            endpoint : "/employment",
            method : "GET"
        })
      }  



      return employment

    }

    deleteEmployment = async (userId, employmentId) => {
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        const employment = await prisma.employmentHistory.findUnique({
            where: { id: employmentId }
        });

        if (!employment) {
            const error = new Error("Employment history not found!");
            error.statusCode = 404;
            throw error;
        }

        if (employment.profileId !== profile.id) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }

        await prisma.employmentHistory.delete({
            where: { id: employmentId }
        });

        if (userId) {
            await this.usageService.usage({
                userId: userId,
                action: "DELETE_EMPLOYMENT",
                endpoint: `/employment/${employmentId}`,
                method: "DELETE"
            });
        }

        return { message: "Employment history deleted successfully" };
    };

    updateEmployment = async (userId,employmentId,companyName,jobTitle,startDate,endDate,description) => {
        if (!companyName || !jobTitle || !startDate) {
            const error = new Error("Company name, job title, and start date are required");
            error.statusCode = 400;
            throw error;
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = endDate ? new Date(endDate) : null;

        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        const employment = await prisma.employmentHistory.findUnique({
            where: { id: employmentId }
        });

        if (!employment) {
            const error = new Error("Employment history not found!");
            error.statusCode = 404;
            throw error;
        }

        if (employment.profileId !== profile.id) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }

        const updatedEmployment = await prisma.employmentHistory.update({
            where: { id: employmentId },
            data: {
                companyName,
                jobTitle,
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                description
            }
        });

        await this.usageService.usage({
            userId: userId,
            action: "UPDATE_EMPLOYMENT",
            endpoint: `/employment/${employmentId}`,
            method: "PUT"
        });

        return updatedEmployment;
    };

}

module.exports={EmploymentService}