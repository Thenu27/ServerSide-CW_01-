const { prisma } = require("../config/prisma");
const crypto = require("crypto");

// Middleware to validate API key
class ApiKeyMiddleware {
  static requireApiKey = async (req, res, next) => {
    try {
      const apiKey = req.headers["x-api-key"]; // Get API key from header

      // Check if API key exists
      if (!apiKey) {
        return res.status(401).json({
          status: "error",
          message: "API key required",
        });
      }

      // Hash API key before checking in DB
      const hashedApiKey = crypto.createHash("sha256").update(apiKey).digest("hex");

      // Find API client in database
      const client = await prisma.apiClient.findUnique({
        where: { apiKey: hashedApiKey },
      });

      // Check if API key is valid
      if (!client) {
        return res.status(403).json({
          status: "error",
          message: "Invalid API key",
        });
      }

      // Check if API key is active
      if (!client.isActive) {
        return res.status(403).json({
          status: "error",
          message: "API key is inactive",
        });
      }

      // Log API usage
      await prisma.apiUsageLog.create({
        data: {
          apiClientId: client.id,
          endpoint: req.originalUrl,
          method: req.method,
        },
      });

      req.apiClient = client; // Attach client to request
      next();
    } catch (err) {
      next(err);
    }
  };
}

// Middleware to check required scope (permission)
const requireScope = (requiredScope) => {
  return (req, res, next) => {
    try {
      const client = req.apiClient;

      // Check if client exists
      if (!client) {
        return res.status(401).json({
          status: "error",
          message: "API client not found",
        });
      }

      // Check if required scope is allowed
      if (!client.scopes || !client.scopes.includes(requiredScope)) {
        return res.status(403).json({
          status: "error",
          message: "Forbidden: insufficient permissions",
        });
      }

      next(); // Allow access
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { ApiKeyMiddleware, requireScope };