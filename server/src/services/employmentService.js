const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

// Service for employment-related logic
class EmploymentService {

    constructor() {
        // Initialize usage logging service
        this.usageService = new UsageService()
    }

    // Add new employment record
    addEmployment = async (userId, companyName, jobTitle, startDate, endDate, industrySector) => {

        // Find user profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }

        // Create employment record
        const employment = await prisma.employmentHistory.create({
            data: {
                profileId: profile.id,
                companyName,
                jobTitle,
                startDate: new Date(startDate), // Convert to Date
                endDate: new Date(endDate),     // Convert to Date
                industrySector
            }
        })

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "ADD_EMPLOYMENT",
                endpoint: "/employment",
                method: "POST"
            })
        }

        return employment
    }

    // Get employment history
    getEmployment = async (userId) => {

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }

        // Fetch employment records
        const employment = await prisma.employmentHistory.findMany({
            where: { profileId: profile.id },
            orderBy: { createdAt: 'desc' }
        })

        if (!employment || employment.length === 0) {
            const error = new Error("Employment history not found!");
            error.statusCode = 404;
            throw error
        }

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "GET_EMPLOYMENT",
                endpoint: "/employment",
                method: "GET"
            })
        }

        return employment
    }

    // Delete employment record
    deleteEmployment = async (userId, employmentId) => {

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        // Find employment
        const employment = await prisma.employmentHistory.findUnique({
            where: { id: employmentId }
        });

        if (!employment) {
            const error = new Error("Employment history not found!");
            error.statusCode = 404;
            throw error;
        }

        // Check ownership
        if (employment.profileId !== profile.id) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }

        // Delete record
        await prisma.employmentHistory.delete({
            where: { id: employmentId }
        });

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "DELETE_EMPLOYMENT",
                endpoint: `/employment/${employmentId}`,
                method: "DELETE"
            });
        }

        return { message: "Employment history deleted successfully" };
    };

    // Update employment record
    updateEmployment = async (userId, employmentId, companyName, jobTitle, startDate, endDate, industrySector) => {

        // Validate required fields
        if (!companyName || !jobTitle || !startDate) {
            const error = new Error("Company name, job title, and start date are required");
            error.statusCode = 400;
            throw error;
        }

        const parsedStartDate = new Date(startDate); // Convert to Date
        const parsedEndDate = endDate ? new Date(endDate) : null;

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error;
        }

        // Find employment
        const employment = await prisma.employmentHistory.findUnique({
            where: { id: employmentId }
        });

        if (!employment) {
            const error = new Error("Employment history not found!");
            error.statusCode = 404;
            throw error;
        }

        // Check ownership
        if (employment.profileId !== profile.id) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }

        // Update record
        const updatedEmployment = await prisma.employmentHistory.update({
            where: { id: employmentId },
            data: {
                companyName,
                jobTitle,
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                industrySector
            }
        });

        // Log usage
        await this.usageService.usage({
            userId,
            action: "UPDATE_EMPLOYMENT",
            endpoint: `/employment/${employmentId}`,
            method: "PUT"
        });

        return updatedEmployment;
    };

}

module.exports = { EmploymentService }