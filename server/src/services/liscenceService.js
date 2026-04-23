const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

// Service for licence-related logic
class LiscenceService {

    constructor() {
        // Initialize usage logging service
        this.usageService = new UsageService()
    }

    // Add new licence
    addLiscence = async (userId, name, issuer, year, url) => {

        // Find user profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }

        // Create licence
        const liscence = await prisma.licence.create({
            data: {
                profileId: profile.id,
                name,
                issuer,
                year,
                url
            }
        })

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "ADD_LISCENCE",
                endpoint: "/liscence",
                method: "POST"
            })
        }

        return liscence
    }

    // Get licences for user
    getLiscence = async (userId) => {

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }

        // Fetch licences
        const liscence = await prisma.licence.findMany({
            where: { profileId: profile.id },
            orderBy: { createdAt: 'desc' }
        });

        if (!liscence || liscence.length === 0) {
            const error = new Error("No liscences Found");
            error.statusCode = 404;
            throw error
        }

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "GET_LISCENCE",
                endpoint: "/liscence",
                method: "GET"
            })
        }

        return liscence
    }

    // Delete licence
    deleteLiscence = async (userId, liscenceId) => {

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        // Find licence
        const liscence = await prisma.licence.findUnique({
            where: { id: liscenceId }
        });

        if (!liscence) {
            const error = new Error("Licence not found!");
            error.statusCode = 404;
            throw error;
        }

        // Check ownership
        if (liscence.profileId !== profile.id) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }

        // Delete licence
        await prisma.licence.delete({
            where: { id: liscenceId }
        });

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "DELETE_LISCENCE",
                endpoint: `/liscence/${liscenceId}`,
                method: "DELETE"
            });
        }

        return { message: "Licence deleted successfully" };
    };

    // Update licence
    updateLiscence = async (userId, liscenceId, name, issuer, year, url) => {

        const parsedYear = Number(year); // Convert year to number

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        // Find licence
        const liscence = await prisma.licence.findUnique({
            where: { id: liscenceId }
        });

        if (!liscence) {
            const error = new Error("Licence not found!");
            error.statusCode = 404;
            throw error;
        }

        // Check ownership
        if (liscence.profileId !== profile.id) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }

        // Update licence
        const updatedLiscence = await prisma.licence.update({
            where: { id: liscenceId },
            data: {
                name,
                issuer,
                year: parsedYear,
                url
            }
        });

        // Log usage
        await this.usageService.usage({
            userId,
            action: "UPDATE_LISCENCE",
            endpoint: `/liscence/${liscenceId}`,
            method: "PUT"
        });

        return updatedLiscence;
    };

}

module.exports = { LiscenceService }