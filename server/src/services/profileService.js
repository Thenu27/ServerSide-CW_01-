const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

// Service for profile-related logic
class ProfileService {

    constructor() {
        // Initialize usage logging service
        this.usageService = new UsageService();
    }

    // Create new profile
    createProfile = async (userId, fullName, bio, linkedIn, imageUrl) => {

        // Check if profile already exists
        const existingProfile = await prisma.profile.findUnique({
            where: { userId: userId }
        })

        if (existingProfile) {
            const error = new Error('Profile Already Exist!');
            error.statusCode = 409;
            throw error
        }

        // Create profile
        const profile = await prisma.profile.create({
            data: {
                userId,
                fullName,
                bio: bio || null,
                linkedIn: linkedIn || null,
                imageUrl: imageUrl || null
            }
        })

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "CREATE_PROFILE",
                endpoint: "/profile",
                method: "POST"
            })
        }

        return profile
    }

    // Get profile with related data
    getProfile = async (userId) => {

        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                degrees: true,
                employmentHistory: true,
                certifications: true,
                licences: true,
                courses: true
            }
        })

        if (!profile) {
            const error = new Error('Profile Not Found!');
            error.statusCode = 404;
            throw error
        }

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "GET_PROFILE",
                endpoint: "/profile",
                method: "GET"
            })
        }

        return profile
    }

    // Update profile
    updateProfile = async (userId, fullName, bio, linkedIn, imageUrl) => {

        // Check if profile exists
        const existingProfile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (!existingProfile) {
            const error = new Error('Profile doesnt exist!');
            error.statusCode = 404;
            throw error
        }

        // Update profile
        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: {
                fullName,
                bio,
                linkedIn,
                imageUrl
            }
        })

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "UPDATE_PROFILE",
                endpoint: "/profile",
                method: "PUT"
            })
        }

        return updatedProfile
    }

    // Delete profile
    deleteProfile = async (userId) => {

        // Check if profile exists
        const existingProfile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!existingProfile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        // Delete profile
        await prisma.profile.delete({
            where: { userId }
        });

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "DELETE_PROFILE",
                endpoint: "/profile",
                method: "DELETE"
            });
        }

        return { message: "Profile deleted successfully" };
    };

    // Get all profiles
    getAllProfiles = async () => {

        const profiles = await prisma.profile.findMany({
            include: {
                degrees: true,
                employmentHistory: true
            }
        });

        if (!profiles) {
            const error = new Error("No Profile found!");
            error.statusCode = 404;
            throw error;
        }

        return {
            profiles
        }
    }

}

module.exports = { ProfileService }