const { prisma } = require("../config/prisma");

class ApiKeyMiddleware {
    static requireApiKey = async (req, res, next) => {
        try {
            const apiKey = req.headers["x-api-key"];

            if (!apiKey) {
                return res.status(401).json({
                    status: "error",
                    message: "API key required"
                });
            }

            const client = await prisma.apiClient.findUnique({
                where: { apiKey }
            });

            if (!client) {
                return res.status(403).json({
                    status: "error",
                    message: "Invalid API key"
                });
            }

            if (!client.isActive) {
                return res.status(403).json({
                    status: "error",
                    message: "API key is inactive"
                });
            }

            await prisma.apiUsageLog.create({
                data: {
                    apiClientId: client.id,
                    endpoint: req.originalUrl,
                    method: req.method
                }
            });

            req.apiClient = client;
            next();
        } catch (err) {
            next(err);
        }
    };
}

module.exports = { ApiKeyMiddleware };