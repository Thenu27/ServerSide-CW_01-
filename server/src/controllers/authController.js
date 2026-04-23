const { AuthService } = require("../services/authService");

// Controller for handling authentication-related requests
class AuthController {
    constructor() {
        // Initialize service
        this.authService = new AuthService();
    }

    // Register new user
    register = async (req, res, next) => {
        try {
            const { email, password } = req.body; // Get user input

            const user = await this.authService.registerUser(email, password);

            res.status(201).json({
                status: "success",
                message: "Registered successfully",
                user
            });

        } catch (err) {
            console.log(err);
            next(err); // Handle error
        }
    }

    // Login user
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const result = await this.authService.loginUser(email, password);

            // Set refresh token in cookie
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: false, // true in production
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            // Send access token
            res.status(200).json({
                status: "success",
                message: "Logged in Succesfully",
                accessToken: result.accessToken
            });

        } catch (err) {
            next(err);
        }
    }

    // Refresh access token
    refresh = async (req, res, next) => {
        try {
            const refreshToken = req.cookies?.refreshToken; // Get refresh token

            const result = await this.authService.refresh(refreshToken);

            res.status(200).json({
                status: "success",
                message: "Access token refreshed",
                accessToken: result.accessToken
            });

        } catch (err) {
            next(err);
        }
    }

    // Logout user
    logout = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies;
            const userId = req.user.userId;

            const result = await this.authService.logout(refreshToken, userId);

            // Clear refresh token cookie
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            return res.status(200).json({
                status: "success",
                message: result.message
            });

        } catch (err) {
            next(err);
        }
    }

    // Verify email using token
    verifyEmail = async (req, res, next) => {
        try {
            const { token } = req.query;

            await this.authService.verifyEmail(token);

            // Redirect on success
            return res.redirect("http://localhost:5173/verify-success");

        } catch (err) {
            console.log(err);

            // Redirect on failure
            return res.redirect("http://localhost:5173/verify-error");
        }
    };

    // Send forgot password email
    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;

            const result = await this.authService.forgotPassword(email);

            return res.status(200).json({
                status: "success",
                message: result.message
            });

        } catch (err) {
            next(err);
        }
    }

    // Reset password using token
    resetPassword = async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;

            const result = await this.authService.resetPassword(token, newPassword);

            return res.status(200).json({
                status: "success",
                message: result.message
            });

        } catch (err) {
            next(err);
        }
    }

}

module.exports = { AuthController };