const { AuthService } = require("../services/authService");

class AuthController{
    constructor(){
        this.authService = new AuthService();
    }

    register = async (req,res,next)=>{
        try{
            const {email,password} = req.body;
            console.log("email:",email)

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
}

module.exports={AuthController}