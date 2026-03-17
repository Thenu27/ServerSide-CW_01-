const { prisma } = require("../config/prisma")

class DegreeService{
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

        return degree;

    };
}

module.exports={DegreeService}