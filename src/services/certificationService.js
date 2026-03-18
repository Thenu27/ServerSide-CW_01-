const { prisma } = require("../config/prisma");

class CertificationService{
    addCertification = async(userId, name, issuer, year)=>{
        const profile = await prisma.profile.findUnique({
            where:{userId}
        })

        if(!profile){
          const error = new Error("Profile not found!");
          error.statusCode = 404;
          throw error
        }

        const certification = await prisma.certification.create({
            data:{
                profileId : profile.id,
                name,
                issuer,
                year
            }
        })

        return certification

    }

    getCertification = async(userId)=>{

        const profile = await prisma.profile.findUnique({
            where:{userId}
        })

        if(!profile){
          const error = new Error("Profile not found!");
          error.statusCode = 404;
          throw error
        }        

        const certification = await prisma.certification.findMany({
            where:{profileId:profile.id},
            orderBy:{createdAt:'desc'}
        })

        return certification
    }
}

module.exports={CertificationService}