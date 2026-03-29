const { prisma } = require("../config/prisma");

class UsageMiddleware {

  usageLogs = async (req, res, next) => {
    try {
      await prisma.usageLog.create({
        data: {
          userId: req.user?.userId || null,
          method: req.method,
          endpoint: req.originalUrl,
          action: "API_ACCESS"
        }
      });
    } catch (err) {
      console.log("Error handling usage logs");
    }

    next();
  };
}

module.exports = { UsageMiddleware };