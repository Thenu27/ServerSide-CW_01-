const { DegreeService } = require("../services/degreeService");

// Controller for degree-related operations
class DegreeController {
    constructor() {
        // Initialize service
        this.degreeService = new DegreeService()
    }

    // Add new degree
    addDegree = async (req, res, next) => {
        try {
            const { degreeName, institution, year, url } = req.body; // Input data
            const userId = req.user.userId; // Logged-in user

            // Validate required fields
            if (!degreeName || !institution || !year || !url) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (degreeName, institution, year, url) are required",
                });
            }

            // Call service to add degree
            const degree = await this.degreeService.addDegree(
                userId,
                degreeName,
                institution,
                year,
                url
            );

            res.status(201).json({
                status: "Success",
                message: "Degree added succesfully!",
                degree
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    // Get degrees for logged-in user
    getDegree = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const degree = await this.degreeService.getDegree(userId);

            res.status(200).json({
                status: "Success",
                message: "Degrees retrieved successfully",
                degree
            });
        } catch (err) {
            next(err);
        }
    }

    // Delete degree
    deleteDegree = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params; // Degree ID

            const result = await this.degreeService.deleteDegree(userId, id);

            res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    };

    // Update degree
    updateDegree = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params; // Degree ID
            const { degreeName, institution, year, url } = req.body;

            // Validate required fields
            if (!degreeName || !institution || !year || !url) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (degreeName, institution, year, url) are required",
                });
            }

            // Update degree
            const degree = await this.degreeService.updateDegree(
                userId,
                id,
                degreeName,
                institution,
                year,
                url
            );

            res.status(200).json({
                status: "success",
                message: "Degree updated successfully",
                degree
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = { DegreeController };