const { prisma } = require("../config/prisma");

class LiscenceService{
    addLiscence = async(userId,name,issuer,year)=>{
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
                year
            }
        })

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
        })

        return liscence
    }
}

module.exports={LiscenceService}