const { ApiService } = require("../services/apiService");

class ApiController {
    constructor() {
        this.apiService = new ApiService();
    }

    createDashboardClient = async (req, res, next) => {
        try {
            const { name } = req.body;
            const userId = req.user.userId;

            const scopes = ["read:alumni", "read:analytics"];

            const client = await this.apiService.createApiKey(
                name,
                userId,
                scopes
            );

            res.status(201).json({
                message: "Dashboard API key created",
                apiKey: client.apiKey,
                scopes: client.scopes
            });
        } catch (err) {
            next(err);
        }
    };

    createArClient = async (req, res, next) => {
        try {
            const { name } = req.body;
            const userId = req.user.userId;

            const scopes = ["read:alumni_of_day"];

            const client = await this.apiService.createApiKey(
                name,
                userId,
                scopes
            );

            res.status(201).json({
                message: "AR app API key created",
                apiKey: client.apiKey,
                scopes: client.scopes
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = { ApiController };