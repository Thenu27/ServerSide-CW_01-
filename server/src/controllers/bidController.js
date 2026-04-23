const { BidService } = require("../services/bidService")

// Controller for handling bid-related requests
class BidController {
    constructor() {
        // Initialize service
        this.bidService = new BidService();
    }

    // Place a new bid
    placeBid = async (req, res, next) => {
        try {
            const { amount } = req.body; // Bid amount
            const userId = req.user.userId; // Logged-in user

            const bid = await this.bidService.placeBid(userId, amount);

            res.status(201).json({
                status: "Success",
                message: "Bid placed successfully",
                bid
            });

        } catch (err) {
            next(err);
        }
    }

    // Get current user's bid
    getBid = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const bid = await this.bidService.getMyBid(userId);

            res.status(200).json({
                status: "Success",
                bid
            });
        } catch (err) {
            next(err);
        }
    }

    // Select winner (admin/manual action)
    selectWinner = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const result = await this.bidService.selectWinner(userId);

            res.status(200).json({
                status: "Success",
                result
            });
        } catch (err) {
            next(err);
        }
    }

    // Get current winner (authenticated)
    getWinner = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const winner = await this.bidService.getCurrentWinner(userId);

            res.status(200).json({
                status: "Success",
                winner
            });
        } catch (err) {
            next(err);
        }
    }

    // Get current winner (public access)
    getWinnerPublic = async (req, res, next) => {
        try {
            const winner = await this.bidService.getWinnerpublic();

            res.status(200).json({
                status: "Success",
                winner
            });
        } catch (err) {
            next(err);
        }
    }

    // Get current user's result (win/lose)
    getMyResult = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const result = await this.bidService.getMyResult(userId);

            res.status(200).json({
                status: "Success",
                result
            });
        } catch (err) {
            next(err);
        }
    }

    // Cancel user's bid
    cancelBid = async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const result = await this.bidService.cancelBid(userId);

            res.status(200).json({
                status: "success",
                message: result.message,
                data: result.bid
            });
        } catch (error) {
            next(error);
        }
    };

}

module.exports = { BidController }