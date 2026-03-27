const express = require("express");
const { BidController } = require("../controllers/bidController");
const { AuthMiddleware } = require("../middleware/authMiddleware");
const { AdminMiddleware } = require("../middleware/adminMiddleware");

const bidRouter = express.Router();
const bidController = new BidController();

bidRouter.post("/", AuthMiddleware.requireAuth, bidController.placeBid);
bidRouter.get("/",AuthMiddleware.requireAuth,bidController.getBid);
bidRouter.post('/winner',AuthMiddleware.requireAuth,AdminMiddleware.requireAdmin,bidController.selectWinner);

/**
 * @swagger
 * /bid/featured:
 *   get:
 *     summary: Get current featured alumnus (winner)
 *     tags: [Bid]
 *     responses:
 *       200:
 *         description: Current featured alumnus
 *       404:
 *         description: No winner found for this month
 */
bidRouter.get('/featured',AuthMiddleware.requireAuth,bidController.getWinner);

module.exports = { bidRouter };