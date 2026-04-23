const { ApiService } = require("../services/apiService");

// Controller for handling API key related requests
class ApiController {
    constructor() {
        // Initialize service
        this.apiService = new ApiService();
    }

    // Create API key for dashboard usage
    createDashboardClient = async (req, res, next) => {
        try {
            const { name } = req.body; // Client name
            const userId = req.user.userId; // Logged-in user

            const scopes = ["read:alumni", "read:analytics"]; // Permissions

            // Create API key
            const client = await this.apiService.createApiKey(
                name,
                userId,
                scopes
            );

            // Send response
            res.status(201).json({
                message: "Dashboard API key created",
                apiKey: client.apiKey,
                scopes: client.scopes
            });
        } catch (err) {
            next(err); // Handle error
        }
    };

    // Create API key for AR app
    createArClient = async (req, res, next) => {
        try {
            const { name } = req.body; // Client name
            const userId = req.user.userId; // Logged-in user

            const scopes = ["read:alumni_of_day"]; // Permissions

            // Create API key
            const client = await this.apiService.createApiKey(
                name,
                userId,
                scopes
            );

            // Send response
            res.status(201).json({
                message: "AR app API key created",
                apiKey: client.apiKey,
                scopes: client.scopes
            });
        } catch (err) {
            next(err); // Handle error
        }
    };
}

module.exports = { ApiController };