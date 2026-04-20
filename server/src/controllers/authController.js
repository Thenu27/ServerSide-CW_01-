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

            const {email,password} = req.body;
            const result = await this.authService.loginUser(email,password);

            res.cookie("refreshToken",result.refreshToken,{
                httpOnly : true,
                secure: false, // true in production with HTTPS
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })


            res.status(200).json({
                status:"success",
                message : "Logged in Succesfully",
                accessToken : result.accessToken
            })
        }catch(err){
            next(err)
        }
    }

    refresh = async(req,res,next)=>{
        try{
                const refreshToken = req.cookies?.refreshToken;
            console.log("refreshToken:",refreshToken)

            const result = await this.authService.refresh(refreshToken);


            res.status(200).json({
                status : "success",
                message : "Access token refreshed",
                accessToken: result.accessToken
            })

        }catch(err){
            next(err)
        }
    }

    logout = async(req,res,next)=>{
        try{
            const {refreshToken} = req.body;
            console.log('hit')
            const userId = req.user.userId
            const result = await this.authService.logout(refreshToken,userId);

            return res.status(200).json({
                status:"success",
                message: result.message
            })

        }catch(err){
            next(err)
        }
    }

    verifyEmail = async (req, res, next) => {
        try {
            const { token } = req.query;
            console.log("VerifyEmuiak")
            await this.authService.verifyEmail(token);

            return res.redirect("http://localhost:5173/verify-success");

        } catch (err) {
            console.log(err);
            return res.redirect("http://localhost:5173/verify-error");
        }
    };

    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            console.log("forgot password hit")
            const result = await this.authService.forgotPassword(email);

            return res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    }

    resetPassword = async (req, res, next) => {
        try {
            console.log("Reset Password")
            const { token, newPassword } = req.body;

            const result = await this.authService.resetPassword(token, newPassword);

            return res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    }



}

module.exports={AuthController}