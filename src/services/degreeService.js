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

        if(!degree || degree.length === 0){
            const error = new Error("No Degree Found");
            error.statusCode = 404;
            throw error
        }

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


    deleteDegree = async (userId, degreeId) => {
            const profile = await prisma.profile.findUnique({
                where: { userId }
            });

            if (!profile) {
                const error = new Error("Profile not found!");
                error.statusCode = 404;
                throw error;
            }

            const degree = await prisma.degree.findUnique({
                where: { id: degreeId }
            });

            if (!degree) {
                const error = new Error("Degree not found!");
                error.statusCode = 404;
                throw error;
            }

            if (degree.profileId !== profile.id) {
                const error = new Error("Forbidden");
                error.statusCode = 403;
                throw error;
            }

            await prisma.degree.delete({
                where: { id: degreeId }
            });

            if (userId) {
                await this.usageService.usage({
                    userId: userId,
                    action: "DELETE_DEGREE",
                    endpoint: `/degree/${degreeId}`,
                    method: "DELETE"
                });
            }

            return { message: "Degree deleted successfully" };
        };


        updateDegree = async (userId, degreeId, degreeName, institution, year) => {
            const parsedYear = Number(year);

            if (!degreeName || !institution || year === undefined || year === null) {
                const error = new Error("Degree name, institution, and year are required");
                error.statusCode = 400;
                throw error;
            }

            const profile = await prisma.profile.findUnique({
                where: { userId }
            });

            if (!profile) {
                const error = new Error("Profile not found!");
                error.statusCode = 404;
                throw error;
            }

            const degree = await prisma.degree.findUnique({
                where: { id: degreeId }
            });

            if (!degree) {
                const error = new Error("Degree not found!");
                error.statusCode = 404;
                throw error;
            }

            if (degree.profileId !== profile.id) {
                const error = new Error("Forbidden");
                error.statusCode = 403;
                throw error;
            }

            const updatedDegree = await prisma.degree.update({
                where: { id: degreeId },
                data: {
                    degreeName,
                    institution,
                    year: parsedYear
                }
            });

            await this.usageService.usage({
                userId: userId,
                action: "UPDATE_DEGREE",
                endpoint: `/degree/${degreeId}`,
                method: "PUT"
            });

            return updatedDegree;
        };


}

module.exports={DegreeService}