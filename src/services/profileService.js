const { prisma } = require("../config/prisma")

class ProfileService{
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
                bio,
                linkedIn,
                imageUrl
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
            where:{userId}
        })

        if(!profile){
            const error = new Error('Profile Not Found!');
            error.statusCode = 409;
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
                method : "GET"
            })
        }

        return updatedProfile

    }
}

module.exports={ProfileService}