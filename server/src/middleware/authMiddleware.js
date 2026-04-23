const { verifyAccessToken } = require('../utils/jwt')

// Middleware to authenticate user using JWT
class AuthMiddleware {

    // Check if request has valid access token
    static requireAuth = (req, res, next) => {
        try {
            const authHeader = req.headers.authorization; // Get Authorization header

            // Validate header format
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    status: "error",
                    message: "Missing or Invalid Authorization header"
                })
            }

            const token = authHeader.split(" ")[1]; // Extract token

            const decoded = verifyAccessToken(token); // Verify token

            req.user = decoded; // Attach user data to request
            next(); // Proceed

        } catch (err) {
            // Handle invalid/expired token
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token",
            })
        }
    }
}

module.exports = { AuthMiddleware };