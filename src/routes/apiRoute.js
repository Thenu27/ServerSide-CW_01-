const { ApiController } = require('../controllers/apiController');
const { BidController } = require('../controllers/bidController');
const { AdminMiddleware } = require('../middleware/adminMiddleware');
const { ApiKeyMiddleware } = require('../middleware/apiKeyMiddleware');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const apiRouter = require('express').Router();

const apiController = new ApiController()
const bidController = new BidController()
/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Create a new API client key
 *     tags: [API Client]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mobile App Client
 *     responses:
 *       201:
 *         description: API key created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API key created
 *                 apiKey:
 *                   type: string
 *                   example: 4f8c8e7c9a9d2c1b6e7f123456789abcdeffedcba1234567890abcdef123456
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
apiRouter.post('/client',AuthMiddleware.requireAuth,apiController.createClient);
/**
 * @swagger
 * /api/winner:
 *   get:
 *     summary: Get today's featured alumnus (Public API)
 *     tags: [Public API]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Winner retrieved successfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key
 */
apiRouter.get('/winner',ApiKeyMiddleware.requireApiKey,bidController.getWinnerPublic);

module.exports={apiRouter}