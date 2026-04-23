// Global error handling middleware
class ErrorMiddleware {

    // Handle all errors in the application
    static handle = (err, req, res, next) => {
        const statusCode = err.statusCode || 500; // Default to 500

        console.log(err); // Log error for debugging

        res.status(statusCode).json({
            status: "error",
            message: err.message || "Internal Server Error"
        });
    }
}

module.exports = { ErrorMiddleware };