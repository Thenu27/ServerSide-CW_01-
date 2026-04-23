const { prisma } = require("../config/prisma");

// Middleware to log API usage
class UsageMiddleware {

  // Log each API request
  usageLogs = async (req, res, next) => {
    try {
      await prisma.usageLog.create({
        data: {
          userId: req.user?.userId || null, // Logged-in user 
          method: req.method, // HTTP method 
          endpoint: req.originalUrl, // Requested URL
          action: "API_ACCESS" // Action type
        }
      });
    } catch (err) {
      console.log("Error handling usage logs"); // Log error
    }

    next(); // Continue request
  };
}

module.exports = { UsageMiddleware };