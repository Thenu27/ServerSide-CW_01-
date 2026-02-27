const { AuthService } = require("../services/authService");

class AuthController{
    constructor(){
        this.authService = new AuthService();
    }

    register = async (req,res,next)=>{
        try{
            const {email,password} = req.body;

            const user = await this.authService.registerUser(email,password);
            res.status(201).json({
                status : "success",
                message : "Registered successfully",
                user
            })

        }catch(err){
            console.log(err)
            next(err)
        }
    }

    login = async(req,res,next)=>{
        try{

            const {email,password} = req.body

            const result = await this.authService.loginUser(email,password)

            res.status(200).json({
                status:"success",
                message : "Logged in Succesfully",
                result
            })
        }catch(err){
            next(err)
        }
    }

    refresh = async(req,res,next)=>{
        try{
            const {refreshToken} = req.body;
            console.log("refreshToken:",refreshToken)

            const result = await this.authService.refresh(refreshToken);


            res.status(200).json({
                status : "success",
                message : "Access token refreshed",
                result
            })

        }catch(err){
            next(err)
        }
    }

    logout = async(req,res,next)=>{
        try{
            const {refreshToken} = req.body;

            const result = await this.authService.logout(refreshToken);

            return res.status(200).json({
                status:"success",
                message: result.message
            })

        }catch(err){
            next(err)
        }
    }
}

module.exports={AuthController}