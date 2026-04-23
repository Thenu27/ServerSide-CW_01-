const { prisma } = require("../config/prisma");

// Service for logging API usage
class UsageService {

  // Save usage log
  async usage({ userId = null, action, endpoint = null, method = null }) {
    try {
      await prisma.usageLog.create({
        data: {
          userId,    // User ID (optional)
          action,    // Action performed
          endpoint,  // API endpoint
          method     // HTTP method
        }
      });
    } catch (err) {
      // Log error but do not break main flow
      console.error("Usage log error:", err.message);
    }
  }

}

module.exports = { UsageService };