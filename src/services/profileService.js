const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

class ProfileService{

    constructor(){
        this.usageService = new UsageService();
    }

    createProfile = async(userId, fullName, bio, linkedIn, imageUrl) =>{
        const existingProfile = await prisma.profile.findUnique({
            where : {userId :userId}
        })


        if(existingProfile){
            const error = new Error('Profile Already Exist!');
            error.statusCode = 409;
            throw error
        }

        const profile = await prisma.profile.create({
            data:{
                userId,
                fullName,
                bio: bio || null,
                linkedIn : linkedIn|| null,
                imageUrl : imageUrl|| null
            }
        })

        if(userId){
            await this.usageService.usage({
                userId : userId,
                action:"CREATE_PROFILE",
                endpoint : "/profile",
                method : "POST"
            })
        }         

        return profile
    }


    getProfile = async(userId)=>{
        const profile = await prisma.profile.findUnique({
            where:{userId},
            include:{
                degrees: true,
                employmentHistory: true,
                certifications: true,
                licences: true,
                courses: true
            }
        })

        if(!profile){
            const error = new Error('Profile Not Found!');
            error.statusCode = 404; // Not Found
            throw error
        }

        if(userId){
            await this.usageService.usage({
                userId : userId,
                action:"GET_PROFILE",
                endpoint : "/profile",
                method : "GET"
            })
        }          

        return profile
    }

    updateProfile = async(userId, fullName, bio, linkedIn, imageUrl)=>{
        const existingProfile = await prisma.profile.findUnique({
            where:{userId}
        })

        if(!existingProfile){
            const error = new Error('Profile doesnt exist!');
            error.statusCode = 404;
            throw error
        }

        const updatedProfile = await prisma.profile.update({
            where:{userId},
            data:{
                fullName,
                 bio,
                 linkedIn,
                 imageUrl
            }
        })

        if(userId){
            await this.usageService.usage({
                userId : userId,
                action:"UPDATE_PROFILE",
                endpoint : "/profile",
                method : "PUT"
            })
        }

        return updatedProfile

    }

    deleteProfile = async (userId) => {
        const existingProfile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!existingProfile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        await prisma.profile.delete({
            where: { userId }
        });

        if (userId) {
            await this.usageService.usage({
                userId: userId,
                action: "DELETE_PROFILE",
                endpoint: "/profile",
                method: "DELETE"
            });
        }

        return { message: "Profile deleted successfully" };
    };





}

module.exports={ProfileService}