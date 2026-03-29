const { prisma } = require("../config/prisma")
const { UsageService } = require("./usageService")

class DegreeService{

    constructor(){
        this.usageService = new UsageService()
    }

    addDegree = async(userId, degreeName, institution, year)=>{
        const profile = await prisma.profile.findUnique({
            where:{userId}
        })

        if(!profile){
            const error = new Error('Profile doesnt exist!')
            error.statusCode = 404;
            throw error
        }

        const degree = await prisma.degree.create({
            data:{
                profileId: profile.id,
                degreeName,
                institution,
                year
            }
        })

        if(userId){
            await this.usageService.usage({
            userId : userId,
            action:"ADD_DEGREE",
            endpoint : "/degree",
            method : "POST"
        })
    }  

        return degree
        
    }

    getDegree = async(userId)=>{
        const profile = await prisma.profile.findUnique({
            where:{userId}
        });

        if(!profile){
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }

        const degree = await prisma.degree.findMany({
            where:{profileId:profile.id},
            orderBy : {createdAt:'desc'}            
        });


        if(userId){
            await this.usageService.usage({
                userId : userId,
                action:"GET_DEGREE",
                endpoint : "/degree",
                method : "GET"
            })
        }  


        return degree;

    };
}

module.exports={DegreeService}