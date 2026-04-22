const { prisma } = require("../config/prisma");
const crypto = require("crypto");

class ApiKeyMiddleware {
  static requireApiKey = async (req, res, next) => {
    try {
      const apiKey = req.headers["x-api-key"];

      if (!apiKey) {
        return res.status(401).json({
          status: "error",
          message: "API key required",
        });
      }

      const hashedApiKey = crypto.createHash("sha256").update(apiKey).digest("hex");

      const client = await prisma.apiClient.findUnique({
        where: { apiKey:hashedApiKey },
      });

      if (!client) {
        return res.status(403).json({
          status: "error",
          message: "Invalid API key",
        });
      }

      if (!client.isActive) {
        return res.status(403).json({
          status: "error",
          message: "API key is inactive",
        });
      }

      await prisma.apiUsageLog.create({
        data: {
          apiClientId: client.id,
          endpoint: req.originalUrl,
          method: req.method,
        },
      });

      req.apiClient = client;
      next();
    } catch (err) {
      next(err);
    }
  };
}

const requireScope = (requiredScope) => {
  return (req, res, next) => {
    try {
      const client = req.apiClient;

      if (!client) {
        return res.status(401).json({
          status: "error",
          message: "API client not found",
        });
      }

      if (!client.scopes || !client.scopes.includes(requiredScope)) {
        return res.status(403).json({
          status: "error",
          message: "Forbidden: insufficient permissions",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { ApiKeyMiddleware, requireScope };