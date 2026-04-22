const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

class CertificationService{

    constructor(){
        this.usageService = new UsageService();
    }

    addCertification = async(userId, name, issuer, year,url)=>{

        // if (!name || !issuer || year === undefined || year === null) {
        //     const error = new Error("Name, issuer, and year are required");
        //     error.statusCode = 400;
        //     throw error;
        // }

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
                year,
                url
            }
        })

        if(userId){
            await this.usageService.usage({
              userId : userId,
              action:"ADD_CERTIFICATION",
              endpoint : "/certification",
              method : "POST"
            })
        }          

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

        if(!certification || certification.length === 0){
            const error = new Error("No certifications Found");
            error.statusCode = 404;
            throw error
        }


        if(userId){
            await this.usageService.usage({
              userId : userId,
              action:"GET_CERTIFICATION",
              endpoint : "/certification",
              method : "GET"
            })
        } 

        return certification
    }

    deleteCertification = async (userId, certificationId) => {
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        const certification = await prisma.certification.findUnique({
            where: { id: certificationId }
        });

        if (!certification) {
            const error = new Error("Certification not found!");
            error.statusCode = 404;
            throw error;
        }

        if (certification.profileId !== profile.id) {
            const error = new Error("Unauthorized to delete this certification!");
            error.statusCode = 401;
            throw error;
        }

        await prisma.certification.delete({
            where: { id: certificationId }
        });

        if (userId) {
            await this.usageService.usage({
                userId: userId,
                action: "DELETE_CERTIFICATION",
                endpoint: `/certification/${certificationId}`,
                method: "DELETE"
            });
        }

        return { message: "Certification deleted successfully" };
    };


    updateCertification = async (userId, certificationId, name, issuer, year,url) => {

        // if (!name || !issuer || year === undefined || year === null ) {
        //     const error = new Error("Name, issuer, and year are required");
        //     error.statusCode = 400;
        //     throw error;
        // }

        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        };

        const certification = await prisma.certification.findUnique({
            where: { id: certificationId }
        });

        if (!certification) {
            const error = new Error("Certification not found!");
            error.statusCode = 404;
            throw error;
        }

        if (certification.profileId !== profile.id) {
            const error = new Error("Forbidden to update this certification!");
            error.statusCode = 403;
            throw error;
        }
        
        const updatedCertification = await prisma.certification.update({
            where: { id: certificationId },
            data: {
                name,
                issuer,
                year,
                url
            }
        });

        await this.usageService.usage({
            userId,
            action: "UPDATE_CERTIFICATION",
            endpoint: `/certification/${certificationId}`,
            method: "PUT"
        });

        return updatedCertification;
    };


getAllCertifications = async () => {
  console.log("Certification hit");

  const groupedCertifications = await prisma.certification.groupBy({
    by: ["name"], // group by certification name
    _count: {
      name: true
    },
    orderBy: {
      _count: {
        name: "desc" // most → least
      }
    }
  });

  return {
    allCert: groupedCertifications
  };
};



}

module.exports={CertificationService}