const crypto = require("crypto");
const { prisma } = require("../config/prisma");

class ApiService {
    generateApiKey = () => {
        return crypto.randomBytes(32).toString("hex");
    };

    createApiKey = async (name, userId) => {
        if (!name) {
            const error = new Error("Client name is required");
            error.statusCode = 400;
            throw error;
        }

        if (!userId) {
            const error = new Error("User ID is required");
            error.statusCode = 400;
            throw error;
        }

        const apiKey = this.generateApiKey();

        const client = await prisma.apiClient.create({
            data: {
                name,
                apiKey,
                userId
            }
        });

        return client;
    };
}

module.exports = { ApiService };