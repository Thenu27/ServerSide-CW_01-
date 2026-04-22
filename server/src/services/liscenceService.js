const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

class LiscenceService{

    constructor(){
        this.usageService = new UsageService()
    }

    addLiscence = async(userId,name,issuer,year,url)=>{
        const profile = await prisma.profile.findUnique({
            where:{userId}
        }) 

        if(!profile){
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }

        const liscence = await prisma.licence.create({
            data:{
                profileId:profile.id,
                name,
                issuer,
                year,
                url
            }
        })

        if(userId){
            await this.usageService.usage({
                userId : userId,
                action:"ADD_LISCENCE",
                endpoint : "/liscence",
                method : "POST"
            })
        } 


        return liscence      
      
    }

    getLiscence = async(userId)=>{
        const profile = await prisma.profile.findUnique({
            where:{userId}
        }) 

        if(!profile){
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }
        
        const liscence = await prisma.licence.findMany({
            where:{profileId:profile.id},
            orderBy:{createdAt : 'desc'}
        });

        if(!liscence || liscence.length === 0){
        const error = new Error("No liscences Found");
        error.statusCode = 404;
        throw error
        }

        if(userId){
            await this.usageService.usage({
                userId : userId,
                action:"GET_LISCENCE",
                endpoint : "/liscence",
                method : "GET"
            })
        } 


        return liscence
    }

    deleteLiscence = async (userId, liscenceId) => {

        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        const liscence = await prisma.licence.findUnique({
          where: { id: liscenceId }
        });

        if (!liscence) {
          const error = new Error("Licence not found!");
          error.statusCode = 404;
          throw error;
        }

            if (liscence.profileId !== profile.id) {
                const error = new Error("Forbidden");
                error.statusCode = 403;
                throw error;
            }

            await prisma.licence.delete({
                where: { id: liscenceId }
            });

            if (userId) {
                await this.usageService.usage({
                    userId: userId,
                    action: "DELETE_LISCENCE",
                    endpoint: `/liscence/${liscenceId}`,
                    method: "DELETE"
                });
            }

            return { message: "Licence deleted successfully" };
        };


        updateLiscence = async (userId, liscenceId, name, issuer, year,url) => {
            const parsedYear = Number(year);

            // if (!name || !issuer || year === undefined || year === null) {
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
            }

            const liscence = await prisma.licence.findUnique({
                where: { id: liscenceId }
            });

            if (!liscence) {
                const error = new Error("Licence not found!");
                error.statusCode = 404;
                throw error;
            }

            if (liscence.profileId !== profile.id) {
                const error = new Error("Forbidden");
                error.statusCode = 403;
                throw error;
            }

            const updatedLiscence = await prisma.licence.update({
                where: { id: liscenceId },
                data: {
                    name,
                    issuer,
                    year: parsedYear,
                    url
                }
            });

            await this.usageService.usage({
                userId: userId,
                action: "UPDATE_LISCENCE",
                endpoint: `/liscence/${liscenceId}`,
                method: "PUT"
            });

            return updatedLiscence;
        };

}

module.exports={LiscenceService}