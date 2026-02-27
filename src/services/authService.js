const {prisma} = require('../config/prisma.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {generateAccessToken,generateRefreshToken, verifyRefreshToken} = require('../utils/jwt');
const { ref } = require('process');
const { access } = require('fs');

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

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))

    await prisma.RefreshToken.create({
        data:{
            userId : user.id,
            tokenHash : refreshTokenHash,
            expiresAt
        }
    })

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

    refresh = async(refreshToken)=>{
        if(!refreshToken){
            const error = new Error('Refresh Token Is Required');
            error.statusCode = 400;
            throw error
        }

        const decoded = verifyRefreshToken(refreshToken)

        const refreshHashToken = crypto.createHash('sha256').update(refreshToken).digest('hex')
        const stored = await prisma.RefreshToken.findUnique({
            where:{
                tokenHash : refreshHashToken,
            }
        })

        if(!stored || stored.revokedAt){
            const error = new Error("Refresh Token is Invalid or Revoked")
            error.statusCode = 401;
            throw error
        };

        if (stored.expiresAt < new Date()) {
            const error = new Error("Refresh token expired");
            error.statusCode = 401;
            throw error;
        }    
        
        const user = await prisma.user.findUnique({
             where : {id : decoded.userId}
        })

        if(!user){
            const error = new Error("No user found")
            error.statusCode = 401;
            throw error;
        }

        const newAccessToken = generateAccessToken({
            userId:user.id,
            email:user.email
        })

        return {
        accessToken : newAccessToken
    }   
    
    }

    logout = async(refreshToken)=>{
        if(!refreshToken){
            const error = new Error("Refresh token is required");
            error.statusCode = 401;
            throw error
        }

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const stored = await prisma.refreshToken.findUnique({
            where : {tokenHash:refreshTokenHash}
        })

        if(!stored){
            return{
                message : "Logged Out"
            }
        }

        await prisma.refreshToken.update({
            where:{tokenHash:refreshTokenHash},
            data:{revokedAt:new Date()},
        })

        return { message : "Logged Out"}
    }



}

module.exports={
    AuthService
}