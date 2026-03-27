const {ApiService} = require('../services/apiService')

class ApiController{
    constructor(){
        this.apiService = new ApiService()
    }

    createClient = async(req,res,next)=>{
        const {name} = req.body;
        const client = await this.apiService.createApiKey(name)

        res.status(201).json({
            message: "API key created",
            apiKey: client.apiKey
        })
    }
}

module.exports={ApiController}