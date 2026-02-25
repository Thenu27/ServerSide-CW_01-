const {prisma} = require('../config/prisma.js')
const bcrypt = require('bcrypt')
const {generateAccessToken,generateRefreshToken} = require('../utils/jwt')

class AuthService{
    registerUser = async (email,password)=>{
        const exisiting = await prisma.user.findUnique({
        where : {email}
        }) 

        if(exisiting){
                const error = new Error("Email already registered");
                error.statusCode = 409 //Conflict
                throw error
            }

            const passwordHash = await bcrypt.hash(password,12);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            isVerified: false,
        },
        select: {
            id: true,
            email: true,
            isVerified: true,
            createdAt: true,
        },
    })

    return user

}

loginUser = async (email,password)=>{
    const user = await prisma.user.findUnique({
        where: {email}
    })

    if(!user){
        const error = new Error("Invalid Email or Password");
        error.statusCode = 401; // Unauthorized
        throw error
    }

    const match = await bcrypt.compare(password,user.passwordHash)
    if(!match){
        const error = new Error("Invalid Email or Password");
        error.statusCode = 401;
        throw error
    }

    if(!(user.isVerified)){
        const error = new Error("Please verify your email before logging in")
        error.statusCode = 403 //Forbidden 
        throw error
    }

    const payload = {userId:user.id, email:user.email}

    const accessToken =  generateAccessToken(payload);
    const refreshToken = generateRefreshToken({userId:user.id})

    return {
        user : {
            id: user.id,
            email:user.email,
            isVerified : user.isVerified
        },

        accessToken : accessToken,
        refreshToken :refreshToken
    }


}

}

module.exports={
    AuthService
}