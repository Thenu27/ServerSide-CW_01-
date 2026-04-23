const { EmploymentService } = require("../services/employmentService")

// Controller for employment-related operations
class EmploymentController {
    constructor() {
        // Initialize service
        this.employmentService = new EmploymentService();
    }

    // Add new employment record
    addEmployment = async (req, res, next) => {
        try {
            const { companyName, jobTitle, startDate, endDate, industrySector } = req.body; // Input data
            const userId = req.user.userId; // Logged-in user

            // Validate required fields
            if (!companyName || !jobTitle || !startDate || !endDate || !industrySector) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields are required",
                });
            }

            // Call service to add employment
            const employment = await this.employmentService.addEmployment(
                userId,
                companyName,
                jobTitle,
                startDate,
                endDate,
                industrySector
            );

            res.status(201).json({
                status: "Success",
                message: "Employment history added successfully",
                employment
            });

        } catch (err) {
            next(err);
        }
    }

    // Get employment history for logged-in user
    getEmployment = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const employment = await this.employmentService.getEmployment(userId);

            res.status(200).json({
                status: "Success",
                message: "Employment history retrieved successfully",
                employment
            });
        } catch (err) {
            next(err);
        }
    }

    // Delete employment record
    deleteEmployment = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params; // Employment ID

            const result = await this.employmentService.deleteEmployment(userId, id);

            res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    };

    // Update employment record
    updateEmployment = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const { id } = req.params; // Employment ID
            const { companyName, jobTitle, startDate, endDate, industrySector } = req.body;

            // Validate required fields
            if (!companyName || !jobTitle) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields (companyName, jobTitle) are required",
                });
            }

            // Update employment
            const employment = await this.employmentService.updateEmployment(
                userId,
                id,
                companyName,
                jobTitle,
                startDate,
                endDate,
                industrySector
            );

            res.status(200).json({
                status: "success",
                message: "Employment history updated successfully",
                employment
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = { EmploymentController }