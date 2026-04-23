const { ProfileService } = require("../services/profileService")

// Controller for profile-related operations
class ProfileController {
    constructor() {
        // Initialize service
        this.profileService = new ProfileService()
    }

    // Create new profile
    createProfile = async (req, res, next) => {
        try {
            const { fullName, bio, linkedIn, imageUrl } = req.body // Input data

            // Validate required field
            if (!fullName) {
                const error = new Error("Full name is required");
                error.statusCode = 400;
                throw error;
            }

            const userId = req.user.userId // Logged-in user

            // Call service to create profile
            const profile = await this.profileService.createProfile(
                userId,
                fullName,
                bio,
                linkedIn,
                imageUrl
            )

            return res.status(201).json({
                status: "success",
                message: "Profile created successfully",
                profile,
            })
        } catch (err) {
            next(err)
        }
    }

    // Get profile for logged-in user
    getProfile = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const profile = await this.profileService.getProfile(userId);

            return res.status(200).json({
                status: "success",
                profile
            })

        } catch (err) {
            next(err)
        }
    }

    // Update profile
    updateProfile = async (req, res, next) => {
        try {
            const { fullName, bio, linkedIn, imageUrl } = req.body;
            const userId = req.user.userId;

            // Call service to update profile
            const updatedProfile = await this.profileService.updateProfile(
                userId,
                fullName,
                bio,
                linkedIn,
                imageUrl
            )

            res.status(200).json({
                status: 'success',
                message: "Profile updated successfully",
                profile: updatedProfile,
            })
        } catch (err) {
            next(err)
        }
    }

    // Delete profile
    deleteProfile = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const result = await this.profileService.deleteProfile(userId);

            return res.status(200).json({
                status: "success",
                message: result.message
            });
        } catch (err) {
            next(err);
        }
    };

    // Get all profiles (admin/global)
    getAllProfiles = async (req, res, next) => {
        try {
            const profiles = await this.profileService.getAllProfiles();

            return res.status(200).json({
                status: "success",
                profiles
            });

        } catch (err) {
            next(err)
        }
    }

}

module.exports = { ProfileController }