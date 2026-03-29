const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

class EmploymentService{

    constructor(){
      this.usageService = new UsageService()
    }

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
}

module.exports={EmploymentService}