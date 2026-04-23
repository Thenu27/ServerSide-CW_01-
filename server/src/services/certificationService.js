const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

// Service for certification-related logic
class CertificationService {

    constructor() {
        // Initialize usage logging service
        this.usageService = new UsageService();
    }

    // Add new certification
    addCertification = async (userId, name, issuer, year, url) => {

        // Find user's profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }

        // Create certification
        const certification = await prisma.certification.create({
            data: {
                profileId: profile.id,
                name,
                issuer,
                year,
                url
            }
        });

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "ADD_CERTIFICATION",
                endpoint: "/certification",
                method: "POST"
            })
        }

        return certification
    }

    // Get certifications for user
    getCertification = async (userId) => {

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            const error = new Error("Profile not found!");
            error.statusCode = 404;
            throw error
        }

        // Fetch certifications
        const certification = await prisma.certification.findMany({
            where: { profileId: profile.id },
            orderBy: { createdAt: 'desc' }
        });

        if (!certification || certification.length === 0) {
            const error = new Error("No certifications Found");
            error.statusCode = 404;
            throw error
        }

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "GET_CERTIFICATION",
                endpoint: "/certification",
                method: "GET"
            })
        }

        return certification
    }

    // Delete certification
    deleteCertification = async (userId, certificationId) => {

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            throw new Error("Profile not found!");
        }

        // Find certification
        const certification = await prisma.certification.findUnique({
            where: { id: certificationId }
        });

        if (!certification) {
            throw new Error("Certification not found!");
        }

        // Check ownership
        if (certification.profileId !== profile.id) {
            const error = new Error("Unauthorized to delete this certification!");
            error.statusCode = 401;
            throw error;
        }

        // Delete certification
        await prisma.certification.delete({
            where: { id: certificationId }
        });

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "DELETE_CERTIFICATION",
                endpoint: `/certification/${certificationId}`,
                method: "DELETE"
            });
        }

        return { message: "Certification deleted successfully" };
    };

    // Update certification
    updateCertification = async (userId, certificationId, name, issuer, year, url) => {

        // Find profile
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            throw new Error("Profile not found!");
        }

        // Find certification
        const certification = await prisma.certification.findUnique({
            where: { id: certificationId }
        });

        if (!certification) {
            throw new Error("Certification not found!");
        }

        // Check ownership
        if (certification.profileId !== profile.id) {
            const error = new Error("Forbidden to update this certification!");
            error.statusCode = 403;
            throw error;
        }

        // Update certification
        const updatedCertification = await prisma.certification.update({
            where: { id: certificationId },
            data: {
                name,
                issuer,
                year,
                url
            }
        });

        // Log usage
        await this.usageService.usage({
            userId,
            action: "UPDATE_CERTIFICATION",
            endpoint: `/certification/${certificationId}`,
            method: "PUT"
        });

        return updatedCertification;
    };

    // Get all certifications grouped by name
    getAllCertifications = async () => {

        const groupedCertifications = await prisma.certification.groupBy({
            by: ["name"], // Group by name
            _count: { name: true },
            orderBy: {
                _count: { name: "desc" } // Most frequent first
            }
        });

        return {
            allCert: groupedCertifications
        };
    };

}

module.exports = { CertificationService }