const {prisma} = require('../config/prisma.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {generateAccessToken,generateRefreshToken, verifyRefreshToken} = require('../utils/jwt');
const {env} = require('../config/env.js')
const { UsageService } = require('./usageService.js');
const {sendEmail} = require('../utils/sendMail.js');
const { NotificationService } = require('./notificationService.js');

const allowedDomains = ["iit.ac.lk","westminster.ac.uk"]

class AuthService{

    constructor(){
        this.usageService = new UsageService();
        this.notificationService = new NotificationService()
    }
    
    registerUser = async (email,password)=>{

        let isValidEmail = false

        // if(email && email.includes("@")){
        //     const domains = email.split("@")[1];
        //     isValidEmail = allowedDomains.includes(domains)
        // }

        // if(!isValidEmail){
        //     const error = new Error("Email not Valid!")
        //     error.statusCode = 409
        //     throw error
        // }

        const existing = await prisma.user.findUnique({
            where : {email}
        }) 

        if(existing){
                const error = new Error("Email already registered");
                error.statusCode = 409 
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

        // const verificationLink = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

        // await this.notificationService.sendEmailVerification({
        //     to: user.email,
        //     link: verificationLink
        // });

        console.log("verificationToken:",verificationToken)

    return user

}

        forgotPassword = async (email) => {
            if (!email) {
                const error = new Error("Email is required");
                error.statusCode = 400;
                throw error;
            }

            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return {
                    message: "If an account with that email exists, a password reset link has been sent"
                };
            }

            await prisma.passwordResetToken.deleteMany({
                where: {
                    userId: user.id,
                    usedAt: null
                }
            });

            const rawToken = crypto.randomBytes(32).toString("hex");
            const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            await prisma.passwordResetToken.create({
                data: {
                    userId: user.id,
                    tokenHash,
                    expiresAt
                }
            });

            const resetLink = `${env.frontendUrl}/reset-password?token=${rawToken}`;

            await sendEmail({
                to: user.email,
                subject: "Reset Your Password",
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Password Reset</h2>
                        <p>You requested to reset your password.</p>
                        <p>Click the button below to reset it:</p>
                        <a href="${resetLink}" 
                        style="display:inline-block;padding:10px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
                        Reset Password
                        </a>
                        <p style="margin-top:16px;">This link will expire in 15 minutes.</p>
                        <p>If you did not request this, you can ignore this email.</p>
                    </div>
                `
            });

            if (user.id) {
                await this.usageService.usage({
                    userId: user.id,
                    action: "FORGOT_PASSWORD",
                    endpoint: "/auth/forgot-password",
                    method: "POST"
                });
            }

            return {
                message: "If an account with that email exists, a password reset link has been sent"
            };
        };


        resetPassword = async (token, newPassword) => {

            if (!token || !newPassword) {
                const error = new Error("Token and new password are required");
                error.statusCode = 400;
                throw error;
            }

            const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

            const resetRecord = await prisma.passwordResetToken.findUnique({
                where: { tokenHash }
            });

            if (!resetRecord) {
                const error = new Error("Invalid reset token");
                error.statusCode = 400;
                throw error;
            }

            if (resetRecord.usedAt) {
                const error = new Error("Reset token already used");
                error.statusCode = 400;
                throw error;
            }

            if (resetRecord.expiresAt < new Date()) {
                const error = new Error("Reset token expired");
                error.statusCode = 400;
                throw error;
            }

            const passwordHash = await bcrypt.hash(newPassword, 12);

            await prisma.$transaction([
                prisma.user.update({
                    where: { id: resetRecord.userId },
                    data: { passwordHash }
                }),
                prisma.passwordResetToken.update({
                    where: { tokenHash },
                    data: { usedAt: new Date() }
                }),
                prisma.refreshToken.updateMany({
                    where: {
                        userId: resetRecord.userId,
                        revokedAt: null
                    },
                    data: {
                        revokedAt: new Date()
                    }
                })
            ]);

            await this.usageService.usage({
                userId: resetRecord.userId,
                action: "RESET_PASSWORD",
                endpoint: "/auth/reset-password",
                method: "POST"
            });

            return {
                message: "Password reset successfully"
            };
        };



loginUser = async (email,password)=>{
    const user = await prisma.user.findUnique({
        where: {email}
    })

    if(!user){
        const error = new Error("Invalid Email or Password");
        error.statusCode = 401; // Unauthorized
        throw error
    }

    const match = await bcrypt.compare(password,user.passwordHash);

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
            userId: user.id,
            email: user.email,
            role: user.role
        });

        return {
            accessToken : newAccessToken
        }   
    
    }



    logout = async(refreshToken,userId)=>{
        console.log('hit')
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
                userId : userId,
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