// Middleware to restrict access to admins only
class AdminMiddleware {

    // Check if user is ADMIN
    static requireAdmin = (req, res, next) => {
        try {
            // Validate user and role
            if (!req.user || req.user.role !== "ADMIN") {
                const error = new Error("Access denied. Admins only.");
                error.statusCode = 403;
                throw error
            }

            next() // Allow access

        } catch (err) {
            next(err) // Handle error
        }
    }
}

module.exports = { AdminMiddleware }