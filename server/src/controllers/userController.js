class UserController{
    me = async(req,res)=>{
        console.log('hit')
        return res.status(200).json({
            status:"success",
            user:req.user
        })
    }
}

module.exports={UserController}