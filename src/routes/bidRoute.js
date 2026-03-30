const express = require("express");
const { BidController } = require("../controllers/bidController");
const { AuthMiddleware } = require("../middleware/authMiddleware");
const { AdminMiddleware } = require("../middleware/adminMiddleware");
const { ApiKeyMiddleware } = require("../middleware/apiKeyMiddleware");

const bidRouter = express.Router();
const bidController = new BidController();

/**
 * @swagger
 * /bid:
 *   post:
 *     summary: Place a bid
 *     tags: [Bid]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Bid placed successfully
 *       400:
 *         description: Invalid amount or new bid must be higher than previous bid
 *       401:
 *         description: Unauthorized
 */
bidRouter.post("/", AuthMiddleware.requireAuth, bidController.placeBid);

/**
 * @swagger
 * /bid:
 *   get:
 *     summary: Get current user's bid
 *     tags: [Bid]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bid retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No bid found for today
 */
bidRouter.get("/",AuthMiddleware.requireAuth,bidController.getBid);
/**
 * @swagger
 * /bid/winner:
 *   post:
 *     summary: Select winner
 *     tags: [Bid]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Winner selected successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: No eligible bids found
 */
bidRouter.post('/winner',AuthMiddleware.requireAuth,AdminMiddleware.requireAdmin,bidController.selectWinner);
/**
 * @swagger
 * /bid/winner:
 *   get:
 *     summary: Get current winner
 *     tags: [Bid]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Winner retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No featured alumnus found for today
 */

bidRouter.get('/winner',AuthMiddleware.requireAuth,bidController.getWinner);
/**
 * @swagger
 * /bid/result:
 *   get:
 *     summary: Get current user's bid result
 *     tags: [Bid]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Result retrieved successfully
 *       401:
 *         description: Unauthorized
 */
bidRouter.get('/result',AuthMiddleware.requireAuth,bidController.getMyResult);

/**
 * @swagger
 * /bid:
 *   delete:
 *     summary: Cancel today's bid
 *     tags: [Bid]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bid cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No bid found for today
 */
bidRouter.delete("/", AuthMiddleware.requireAuth, bidController.cancelBid);





module.exports = { bidRouter };