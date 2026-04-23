const { LiscenceService } = require("../services/liscenceService");

// Controller for licence-related operations
class LiscenceController {

    constructor() {
        // Initialize service
        this.liscenceService = new LiscenceService()
    }

    // Add new licence
    addLiscence = async (req, res, next) => {
        try {
            const { name, issuer, year, url } = req.body; // Input data
            const userId = req.user.userId; // Logged-in user

            // Validate required fields
            if (!name || !issuer || !year || !url) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (name, issuer, year) are required",
                });
            }

            // Call service to add licence
            const liscence = await this.liscenceService.addLiscence(
                userId,
                name,
                issuer,
                year,
                url
            );

            res.status(201).json({
                status: "success",
                message: "Licence added successfully",
                liscence
            });
        } catch (err) {
            next(err);
        }
    }

    // Get licences for logged-in user
    getLiscence = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const liscence = await this.liscenceService.getLiscence(userId);

            res.status(200).json({
                status: "success",
                message: "Licences retrieved successfully",
                liscence
            });

        } catch (err) {
            next(err);
        }
    }

    // Delete licence
    deleteLiscence = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params; // Licence ID

            const result = await this.liscenceService.deleteLiscence(userId, id);

            res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    };

    // Update licence
    updateLiscence = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params; // Licence ID
            const { name, issuer, year, url } = req.body;

            // Validate required fields
            if (!name || !issuer || !year || !url) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (name, issuer, year) are required",
                });
            }

            // Update licence
            const liscence = await this.liscenceService.updateLiscence(
                userId,
                id,
                name,
                issuer,
                year,
                url
            );

            res.status(200).json({
                status: "success",
                message: "Licence updated successfully",
                liscence
            });
        } catch (err) {
            next(err);
        }
    };

}

module.exports = { LiscenceController }