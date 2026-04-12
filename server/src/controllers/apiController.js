const { ApiService } = require("../services/apiService");

class ApiController {
    constructor() {
        this.apiService = new ApiService();
    }

    createClient = async (req, res, next) => {
        try {
            const { name } = req.body;
            const userId = req.user.userId;

            const client = await this.apiService.createApiKey(name,userId);

            res.status(201).json({
                message: "API key created",
                apiKey: client.apiKey
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = { ApiController };