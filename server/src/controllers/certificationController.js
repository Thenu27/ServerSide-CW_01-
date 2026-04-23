const express = require("express");
const { CertificationService } = require("../services/certificationService")

// Controller for certification-related operations
class CertificationController {
    constructor() {
        // Initialize service
        this.certificationService = new CertificationService()
    }

    // Add new certification
    addCertification = async (req, res, next) => {
        try {
            const { name, issuer, year, url } = req.body; // Input data
            const userId = req.user.userId; // Logged-in user

            // Validate required fields
            if (!name || !issuer || !year || !url) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (name, issuer, year, url) are required"
                });
            }

            // Call service to add certification
            const certification = await this.certificationService.addCertification(
                userId,
                name,
                issuer,
                year,
                url
            );

            res.status(201).json({
                status: "success",
                message: "Certification added successfully",
                certification
            });

        } catch (err) {
            next(err);
        }
    };

    // Get certifications for logged-in user
    getCertification = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const certification = await this.certificationService.getCertification(userId);

            res.status(200).json({
                status: "success",
                message: "Certifications retrieved successfully",
                certification
            });

        } catch (err) {
            next(err)
        }
    }

    // Delete certification
    deleteCertification = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params; // Certification ID

            const result = await this.certificationService.deleteCertification(userId, id);

            res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    };

    // Update certification
    updateCertification = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params; // Certification ID
            const { name, issuer, year, url } = req.body;

            // Check ID
            if (!id) {
                return res.status(400).json({
                    status: "error",
                    message: "Certification ID is required"
                });
            }

            // Validate fields
            if (!name || !issuer || !year || !url) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (name, issuer, year, url) are required"
                });
            }

            // Update certification
            const certification = await this.certificationService.updateCertification(
                userId,
                id,
                name,
                issuer,
                year,
                url
            );

            // Check if exists
            if (!certification) {
                return res.status(404).json({
                    status: "error",
                    message: "Certification not found"
                });
            }

            res.status(200).json({
                status: "success",
                message: "Certification updated successfully",
                certification
            });

        } catch (err) {
            next(err);
        }
    };

    // Get all certifications 
    getAllCertifcations = async (req, res, next) => {
        try {
            const result = await this.certificationService.getAllCertifications();

            res.status(200).json({
                status: "success",
                message: "Retreived All Certification successfully",
                allCert: result.allCert
            });
        } catch (err) {
            console.log(err)
        }
    }

}

module.exports = { CertificationController }