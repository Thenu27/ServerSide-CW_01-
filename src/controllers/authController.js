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
}

module.exports={AuthController}