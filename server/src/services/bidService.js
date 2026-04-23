const { BidStatus } = require("@prisma/client");
const { prisma } = require("../config/prisma");
const { normalizeDate } = require('../utils/date');
const { NotificationService } = require("./notificationService");
const { UsageService } = require("./usageService");

// Service for handling bidding logic
class BidService {

    constructor() {
        // Initialize services
        this.usageService = new UsageService();
        this.notificationService = new NotificationService();
    }

    // Place or update a bid
    placeBid = async (userId, amount) => {

        // Check if profile exists
        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile) {
            const error = new Error("Profile not found");
            error.statusCode = 404;
            throw error;
        }

        // Validate amount
        if (!amount || amount <= 0) {
            const error = new Error("Invalid Amount!");
            error.statusCode = 400;
            throw error;
        }

        const bidDate = normalizeDate(); // Normalize to today
        let savedBid;

        // Check existing bid for today
        const existingBid = await prisma.bid.findUnique({
            where: {
                userId_bidDate: { userId, bidDate }
            }
        });

        // Create new bid
        if (!existingBid) {
            savedBid = await prisma.bid.create({
                data: {
                    userId,
                    amount,
                    bidDate,
                    status: BidStatus.ACTIVE
                }
            });
        }
        // Reactivate cancelled bid
        else if (existingBid.status === "CANCELLED") {
            savedBid = await prisma.bid.update({
                where: { userId_bidDate: { userId, bidDate } },
                data: { amount, status: BidStatus.ACTIVE }
            });
        }
        // Update existing bid
        else {
            if (amount <= existingBid.amount) {
                const error = new Error("New bid must be higher than previous bid");
                error.statusCode = 400;
                throw error;
            }

            savedBid = await prisma.bid.update({
                where: { userId_bidDate: { userId, bidDate } },
                data: { amount }
            });
        }

        // Get user email
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Send notification email
        await this.notificationService.sendBidPlacedEmail({
            to: user.email,
            date: bidDate,
            amount
        });

        // Log usage
        await this.usageService.usage({
            userId,
            action: "PLACE_BID",
            endpoint: "/bid",
            method: "POST"
        });

        return savedBid;
    };

    // Get current user's bid and status
    getMyBid = async (userId) => {

        const bidDate = normalizeDate();
        let currentStatus = null;

        // Get user's active bid
        const bid = await prisma.bid.findFirst({
            where: { userId, bidDate, status: BidStatus.ACTIVE }
        });

        if (!bid) {
            const error = new Error("No bid found for this date");
            error.statusCode = 404;
            throw error;
        }

        // Get current highest bidder
        const currentWinner = await prisma.bid.findFirst({
            where: { bidDate, status: BidStatus.ACTIVE },
            orderBy: { amount: "desc" }
        });

        // Determine status
        currentStatus = currentWinner && currentWinner.userId === bid.userId
            ? "WINNING"
            : "LOSING";

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "GET_BID",
                endpoint: "/bid",
                method: "GET"
            })
        }

        return { currentStatus, bid }
    };

    // Update winner + losers status
    changeBidStatus = async (winnerUserId, date) => {

        // Mark winner
        await prisma.bid.update({
            where: { userId_bidDate: { userId: winnerUserId, bidDate: date } },
            data: { status: BidStatus.WIN }
        });

        // Get winner email
        const userWin = await prisma.user.findUnique({
            where: { id: winnerUserId }
        });

        if (!userWin || !userWin.email) {
            throw new Error("Winner user not found");
        }

        // Send winner email
        await this.notificationService.sendWinnerEmail({
            to: userWin.email, date
        });

        // Get losers
        const loserBids = await prisma.bid.findMany({
            where: {
                bidDate: date,
                userId: { not: winnerUserId },
                status: BidStatus.ACTIVE
            },
            include: { user: true }
        });

        // Mark losers
        const statusLose = await prisma.bid.updateMany({
            where: {
                bidDate: date,
                userId: { not: winnerUserId },
                status: BidStatus.ACTIVE
            },
            data: { status: BidStatus.LOSE }
        });

        // Notify losers
        const uniqueEmails = [...new Set(loserBids.map(bid => bid.user.email))];

        for (const email of uniqueEmails) {
            await this.notificationService.sendLoserEmail({ to: email, date });
        }

        return {
            winnerUpdated: 1,
            losersUpdated: statusLose.count
        };
    }

    // Select winner for today
    selectWinner = async (userId) => {

        const date = normalizeDate();

        // Prevent duplicate winner
        const existingWinner = await prisma.featuredAlumnus.findUnique({
            where: { date },
        });

        if (existingWinner) {
            throw new Error("Winner already selected for today");
        }

        // Get bids sorted by highest
        const bids = await prisma.bid.findMany({
            where: { bidDate: date, status: BidStatus.ACTIVE },
            orderBy: { amount: "desc" },
        });

        if (bids.length === 0) {
            throw new Error("No bids found for today");
        }

        // Select highest valid bidder
        let winnerUserId = bids[0].userId;

        // Create featured alumnus
        const winner = await prisma.featuredAlumnus.create({
            data: { userId: winnerUserId, date },
        });

        // Update bid statuses
        if (winner) {
            await this.changeBidStatus(winnerUserId, date);
        }

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "SELECT_WINNER",
                endpoint: "/bid/winner",
                method: "POST"
            })
        }

        return winner;
    };

    // Get current winner (private)
    getCurrentWinner = async (userId) => {
        const date = normalizeDate();

        const winner = await prisma.featuredAlumnus.findUnique({
            where: { date },
            include: {
                user: { include: { profile: true } }
            },
        });

        if (!winner) throw new Error("No featured alumnus found!");

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "GET_WINNER",
                endpoint: "/bid/winner",
                method: "GET"
            })
        }

        return winner;
    };

    // Get current winner (public)
    getWinnerpublic = async () => {
        const date = normalizeDate();

        const winner = await prisma.featuredAlumnus.findUnique({
            where: { date },
            include: {
                user: { include: { profile: true } }
            },
        });

        if (!winner) throw new Error("No featured alumnus found!");

        return winner;
    };

    // Get user's result (win/lose)
    getMyResult = async (userId) => {
        const date = normalizeDate();

        const bid = await prisma.bid.findFirst({
            where: { bidDate: date, userId }
        });

        if (!bid) throw new Error("No Bid Found!");

        const winner = await prisma.featuredAlumnus.findUnique({
            where: { date }
        });

        if (!winner) {
            return {
                status: BidStatus.PENDING,
                messages: "Winner not selected yet"
            }
        }

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "GET_MY_RESULT",
                endpoint: "/bid/result",
                method: "GET"
            })
        }

        return winner.userId === userId
            ? { status: BidStatus.WIN, messages: "You won!" }
            : { status: BidStatus.LOSE, messages: "You lost!" }
    }

    // Cancel bid
    cancelBid = async (userId) => {

        const bidDate = normalizeDate();

        const bid = await prisma.bid.findUnique({
            where: { userId_bidDate: { userId, bidDate } }
        });

        if (!bid) throw new Error("No bid found");

        if (bid.status === BidStatus.CANCELLED) {
            throw new Error("Already cancelled");
        }

        const cancelledBid = await prisma.bid.update({
            where: { userId_bidDate: { userId, bidDate } },
            data: { status: BidStatus.CANCELLED }
        });

        // Notify user
        const user = await prisma.user.findUnique({ where: { id: userId } });

        await this.notificationService.sendCancelEmail({
            to: user.email, date: bidDate
        });

        // Log usage
        if (userId) {
            await this.usageService.usage({
                userId,
                action: "CANCEL_BID",
                endpoint: "/bid",
                method: "DELETE"
            });
        }

        return {
            message: "Bid cancelled successfully",
            bid: cancelledBid
        };
    };
}

module.exports = { BidService }