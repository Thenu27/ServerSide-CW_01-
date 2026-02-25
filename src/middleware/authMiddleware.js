const {verifyAccessToken} = require('../utils/jwt')

class AuthMiddleware{
    static requireAuth=(req,res,next)=>{
        try{
            const authHeader = req.headers.authorization;

            if(!authHeader || !authHeader.startsWith("Bearer ")){
                return res.status(401).json({
                    status:"error",
                    message:"Missing or Invalid Authorization header"
                })
            }

            const token = authHeader.split(" ")[1];
            const decoded = verifyAccessToken(token);

            req.user = decoded;
            next();

        }catch(err){
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token",                
            })
        }
    }
}

module.exports = { AuthMiddleware };