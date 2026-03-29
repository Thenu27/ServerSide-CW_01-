const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

class LiscenceService{

    constructor(){
        this.usageService = new UsageService()
    }

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
        })

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
}

module.exports={LiscenceService}