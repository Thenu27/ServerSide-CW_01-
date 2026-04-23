// Controller for user-related operations
class UserController {

    // Get current logged-in user details
    me = async (req, res) => {
        return res.status(200).json({
            status: "success",
            user: req.user // User from auth middleware
        })
    }
}

module.exports = { UserController }