const {prisma} = require('../config/prisma.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {generateAccessToken,generateRefreshToken, verifyRefreshToken} = require('../utils/jwt');
const { ref } = require('process');
const { access } = require('fs');
const { UsageService } = require('./usageService.js');

const allowedDomains = ["iit.ac.lk","westminster.ac.uk"]

class AuthService{

    constructor(){
        this.usageService = new UsageService()
    }
    
    registerUser = async (email,password)=>{

        let isValidEmail = false

        if(email && email.includes("@")){
            const domains = email.split("@")[1];
            isValidEmail = allowedDomains.includes(domains)
        }

        if(!isValidEmail){
            const error = new Error("Email not Valid!")
            error.statusCode = 409
            throw error
        }

        const existing = await prisma.user.findUnique({
            where : {email}
        }) 

        if(existing){
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

        if(user){
            await this.usageService.usage({
                 userId : user.id,
                 action:"REGISTER",
                 endpoint : "/auth/register",
                 method : "POST"
            })
        }

    const verificationToken = await this.createEmailVerificationToken(user.id);
    console.log("Email verification token:", verificationToken);



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

    const payload = {userId:user.id, email:user.email, role:user.role};

    const accessToken =  generateAccessToken(payload);
    const refreshToken = generateRefreshToken({userId:user.id})

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))

    await prisma.refreshToken.create({
        data:{
            userId : user.id,
            tokenHash : refreshTokenHash,
            expiresAt
        }
    })

    if(user){
        await this.usageService.usage({
           userId : user.id,
           action:"LOGIN",
           endpoint : "/auth/login",
           method : "POST"
        })
    }

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
        const stored = await prisma.refreshToken.findUnique({
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



    logout = async(refreshToken,userId)=>{
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

        if(userId){
            await this.usageService.usage({
                userId : user.id,
                action:"LOGOUT",
                endpoint : "/auth/logout",
                method : "POST"
        })
    }

        return { message : "Logged Out"}
    }

    createEmailVerificationToken = async(userId)=>{
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        console.log("prisma =", prisma);
console.log("emailVerificationToken model =", prisma.emailVerificationToken);
        await prisma.emailVerificationToken.deleteMany({
            where:{userId}
        })

        await prisma.emailVerificationToken.create({
            data:{
                userId,
                tokenHash,
                expiresAt
            }
        })

        return rawToken
    }


    verifyEmail = async(token)=>{
        if(!token){
            const error =new Error("Verification Token Required!");
            error.statusCode = 400;
            throw error
        }
        console.log("Verfiy Email:",token)
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const storedToken = await prisma.emailVerificationToken.findUnique({
            where:{tokenHash}
        })

        if(!storedToken){
            const error = new Error("Invalid Verififcation Token!");
            error.statusCode=400;
            throw error
        }

        if(storedToken.usedAt){
            const error = new Error("Verififcation Token Already Used!");
            error.statusCode=400;
            throw error            
        }

        if(storedToken.expiresAt <Date.now()){
            const error = new Error("Verification Token Expired!");
            error.statusCode = 400;
            throw error
        }   

        await prisma.emailVerificationToken.update({
            where:{tokenHash},
            data: {usedAt : new Date}
        })

        await prisma.user.update({
            where:{id:storedToken.userId},
            data:{isVerified:true}
        })

        return {message : "Email verified succesfully!"};
    }

}

module.exports={
    AuthService
}