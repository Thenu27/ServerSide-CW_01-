const { prisma } = require("../config/prisma")
const { UsageService } = require("./usageService")

// Service for degree-related logic
class DegreeService {

    constructor() {
        // Initialize usage logging service
        this.usageService = new UsageService()
    }

    // Add new degree
    addDegree = async (userId, degreeName, institution, year, url) => {

        // Find user profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (!profile) {
            const error = new Error('Profile doesnt exist!')
            error.statusCode = 404;
            throw error
        }

        // Create degree
        const degree = await prisma.degree.create({
            data: {
                profileId: profile.id,
                degreeName,
                institution,
                year,
                url
            }
        })

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "ADD_DEGREE",
                endpoint: "/degree",
                method: "POST"
            })
        }

        return degree
    }

    // Get degrees for user
    getDegree = async (userId) => {

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }

        // Fetch degrees
        const degree = await prisma.degree.findMany({
            where: { profileId: profile.id },
            orderBy: { createdAt: 'desc' }
        });

        if (!degree || degree.length === 0) {
            const error = new Error("No Degree Found");
            error.statusCode = 404;
            throw error
        }

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "GET_DEGREE",
                endpoint: "/degree",
                method: "GET"
            })
        }

        return degree;
    };

    // Delete degree
    deleteDegree = async (userId, degreeId) => {

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        // Find degree
        const degree = await prisma.degree.findUnique({
            where: { id: degreeId }
        });

        if (!degree) {
            const error = new Error("Degree not found!");
            error.statusCode = 404;
            throw error;
        }

        // Check ownership
        if (degree.profileId !== profile.id) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }

        // Delete degree
        await prisma.degree.delete({
            where: { id: degreeId }
        });

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "DELETE_DEGREE",
                endpoint: `/degree/${degreeId}`,
                method: "DELETE"
            });
        }

        return { message: "Degree deleted successfully" };
    };

    // Update degree
    updateDegree = async (userId, degreeId, degreeName, institution, year, url) => {

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

        // Find degree
        const degree = await prisma.degree.findUnique({
            where: { id: degreeId }
        });

        if (!degree) {
            const error = new Error("Degree not found!");
            error.statusCode = 404;
            throw error;
        }

        // Check ownership
        if (degree.profileId !== profile.id) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }

        // Update degree
        const updatedDegree = await prisma.degree.update({
            where: { id: degreeId },
            data: {
                degreeName,
                institution,
                year: parsedYear,
                url
            }
        });

        // Log usage
        await this.usageService.usage({
            userId,
            action: "UPDATE_DEGREE",
            endpoint: `/degree/${degreeId}`,
            method: "PUT"
        });

        return updatedDegree;
    };

}

module.exports = { DegreeService }