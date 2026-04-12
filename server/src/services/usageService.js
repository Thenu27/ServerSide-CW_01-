const { prisma } = require("../config/prisma");

class UsageService {

  async usage({ userId = null, action, endpoint = null, method = null }) {
    try {
      await prisma.usageLog.create({
        data: {
          userId,
          action,
          endpoint,
          method
        }
      });
    } catch (err) {
      console.error("Usage log error:", err.message);
    }
  }

}

module.exports = { UsageService };