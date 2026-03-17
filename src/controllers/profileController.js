const { ProfileService } = require("../services/profileService")

class ProfileController{
    constructor(){
        this.profileService = new ProfileService()
    }

    createProfile = async(req,res,next)=>{
        try{
            const {fullName, bio, linkedIn, imageUrl} = req.body

            const userId = req.user.userId;

            const profile = await this.profileService.createProfile(
                userId,
                fullName,
                bio,
                linkedIn,
                imageUrl
            )

            return res.status(200).json({
                status: "success",
                message: "Profile created successfully",
                profile,
            })
        }catch(err){
            next(err)
        }
    }

    getProfile = async(req,res,next)=>{
        try{
            const userId = req.user.userId;

            const profile = await this.profileService.getProfile(userId);

            return res.status(200).json({
                status:"success",
                profile
            })

        }catch(err){
            next(err)
        }

    }

    updateProfile = async(req,res,next)=>{
        try{
            const {fullName, bio, linkedIn, imageUrl} = req.body
            const userId = req.user.userId

            const updatedProfile = await this.profileService.updateProfile(
               userId,fullName,bio,linkedIn,imageUrl
            )

            res.status(200).json({
                status:'success',
                message: "Profile updated successfully",
                profile: updatedProfile,
            })
        }catch(err){
            next(err)
        }

    }

}

module.exports={ProfileController}