const crypto = require("crypto");
const { prisma } = require("../config/prisma");

// Service for handling API key creation
class ApiService {

    // Generate random API key
    generateApiKey = () => {
        return crypto.randomBytes(32).toString("hex");
    };

    // Create new API key for a client
    createApiKey = async (name, userId, scopes = []) => {

        // Validate client name
        if (!name) {
            const error = new Error("Client name is required");
            error.statusCode = 400;
            throw error;
        }

        // Validate user ID
        if (!userId) {
            const error = new Error("User ID is required");
            error.statusCode = 400;
            throw error;
        }

        // Validate scopes
        if (!Array.isArray(scopes) || scopes.length === 0) {
            const error = new Error("Scopes are required");
            error.statusCode = 400;
            throw error;
        }

        const apiKey = this.generateApiKey(); // Generate raw key

        // Hash API key before storing
        const hashedApiKey = crypto
            .createHash("sha256")
            .update(apiKey)
            .digest("hex");

        // Save client in database
        const client = await prisma.apiClient.create({
            data: {
                name,
                apiKey: hashedApiKey,
                userId,
                scopes
            }
        });

        // Return client + raw API key 
        return {
            client,
            apiKey
        };
    };
}

module.exports = { ApiService };