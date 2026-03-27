const e = require("express")

class AdminMiddleware{
    static requireAdmin=(req,res,next)=>{
        try{
            if(!req.user || req.user.role !== "ADMIN"){
                const error = new Error("Access denied. Admins only.");
                error.statusCode = 403;
                throw error
            }

            next()

        }catch(err){
            next(err)
        }
    }
}

module.exports = {AdminMiddleware}