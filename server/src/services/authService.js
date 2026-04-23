const { prisma } = require('../config/prisma.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { env } = require('../config/env.js');
const { UsageService } = require('./usageService.js');
const { sendEmail } = require('../utils/sendMail.js');
const { NotificationService } = require('./notificationService.js');

// Allowed email domains (currently unused)
const allowedDomains = ["iit.ac.lk", "westminster.ac.uk"]

class AuthService {

    constructor() {
        // Initialize services
        this.usageService = new UsageService();
        this.notificationService = new NotificationService()
    }

    // Register new user
    registerUser = async (email, password) => {

        let isValidEmail = false


        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email }
        })

        if (existing) {
            const error = new Error("Email already registered");
            error.statusCode = 409
            throw error
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
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

        // Log usage
        if (user) {
            await this.usageService.usage({
                userId: user.id,
                action: "REGISTER",
                endpoint: "/auth/register",
                method: "POST"
            })
        }

        // Create email verification token
        const verificationToken = await this.createEmailVerificationToken(user.id);

        const verificationLink = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

        // Send verification email
        await this.notificationService.sendEmailVerification({
            to: user.email,
            link: verificationLink
        });

        return user
    }

    // Forgot password (send reset email)
    forgotPassword = async (email) => {
        if (!email) {
            const error = new Error("Email is required");
            error.statusCode = 400;
            throw error;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Always return same message (security)
        if (!user) {
            return {
                message: "If an account exists, a reset link has been sent"
            };
        }

        // Remove old tokens
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id, usedAt: null }
        });

        // Generate reset token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Store token
        await prisma.passwordResetToken.create({
            data: { userId: user.id, tokenHash, expiresAt }
        });

        const resetLink = `${env.frontendUrl}/reset-password?token=${rawToken}`;

        // Send email
        await sendEmail({
            to: user.email,
            subject: "Reset Your Password",
            html: `...`
        });

        // Log usage
        if (user.id) {
            await this.usageService.usage({
                userId: user.id,
                action: "FORGOT_PASSWORD",
                endpoint: "/auth/forgot-password",
                method: "POST"
            });
        }

        return {
            message: "If an account exists, a reset link has been sent"
        };
    };

    // Reset password
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

        // Validate token
        if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
            const error = new Error("Invalid or expired reset token");
            error.statusCode = 400;
            throw error;
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 12);

        // Update password + revoke tokens
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
                where: { userId: resetRecord.userId, revokedAt: null },
                data: { revokedAt: new Date() }
            })
        ]);

        // Log usage
        await this.usageService.usage({
            userId: resetRecord.userId,
            action: "RESET_PASSWORD",
            endpoint: "/auth/reset-password",
            method: "POST"
        });

        return { message: "Password reset successfully" };
    };

    // Login user
    loginUser = async (email, password) => {

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new Error("Invalid Email or Password");

        const match = await bcrypt.compare(password, user.passwordHash);

        if (!match) throw new Error("Invalid Email or Password");

        if (!user.isVerified) {
            const error = new Error("Please verify your email");
            error.statusCode = 403;
            throw error
        }

        // Generate tokens
        const payload = { userId: user.id, email: user.email, role: user.role };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken({ userId: user.id });

        // Store refresh token
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: refreshTokenHash,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        // Log usage
        if (user) {
            await this.usageService.usage({
                userId: user.id,
                action: "LOGIN",
                endpoint: "/auth/login",
                method: "POST"
            })
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                isVerified: user.isVerified
            },
            accessToken,
            refreshToken
        }
    }

    // Refresh access token
    refresh = async (refreshToken) => {

        if (!refreshToken) throw new Error('Refresh Token Required');

        const decoded = verifyRefreshToken(refreshToken);

        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const stored = await prisma.refreshToken.findUnique({
            where: { tokenHash: hash }
        });

        if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
            throw new Error("Invalid refresh token");
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        return {
            accessToken: generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role
            })
        }
    }

    // Logout user
    logout = async (refreshToken, userId) => {

        if (!refreshToken) throw new Error("Refresh token required");

        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        await prisma.refreshToken.update({
            where: { tokenHash: hash },
            data: { revokedAt: new Date() },
        });

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "LOGOUT",
                endpoint: "/auth/logout",
                method: "POST"
            })
        }

        return { message: "Logged Out" }
    }

    // Create email verification token
    createEmailVerificationToken = async (userId) => {
        const rawToken = crypto.randomBytes(32).toString('hex');

        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.emailVerificationToken.deleteMany({ where: { userId } });

        await prisma.emailVerificationToken.create({
            data: { userId, tokenHash, expiresAt }
        });

        return rawToken
    }

    // Verify email
    verifyEmail = async (token) => {

        if (!token) throw new Error("Verification token required");

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const storedToken = await prisma.emailVerificationToken.findUnique({
            where: { tokenHash }
        });

        if (!storedToken || storedToken.usedAt || storedToken.expiresAt < Date.now()) {
            throw new Error("Invalid or expired token");
        }

        await prisma.emailVerificationToken.update({
            where: { tokenHash },
            data: { usedAt: new Date() }
        });

        await prisma.user.update({
            where: { id: storedToken.userId },
            data: { isVerified: true }
        });

        return { message: "Email verified successfully!" };
    }

}

module.exports = { AuthService }