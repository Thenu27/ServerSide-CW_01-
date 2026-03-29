const crypto = require('crypto');
const { prisma } = require('../config/prisma');

class ApiService{
     generateApiKey=()=>{
        return crypto.randomBytes(32).toString('hex')
    }

    createApiKey = async(name)=>{
        const api_key = this.generateApiKey();
        const client = await prisma.apiClient.create({
            data:{
                name,
                api_key
            }
        })

        return client;
    }
}

module.exports = {ApiService} 