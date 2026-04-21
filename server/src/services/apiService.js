const crypto = require("crypto");
const { prisma } = require("../config/prisma");

class ApiService {
    generateApiKey = () => {
        return crypto.randomBytes(32).toString("hex");
    };

    createApiKey = async (name, userId, scopes = []) => {
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

        if (!Array.isArray(scopes) || scopes.length === 0) {
            const error = new Error("Scopes are required");
            error.statusCode = 400;
            throw error;
        }

        const apiKey = this.generateApiKey();

        const client = await prisma.apiClient.create({
            data: {
                name,
                apiKey,
                userId,
                scopes   
            }
        });

        return client;
    };
}

module.exports = { ApiService };