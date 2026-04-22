const { ApiController } = require('../controllers/apiController');
const { BidController } = require('../controllers/bidController');
const { ApiKeyMiddleware } = require('../middleware/apiKeyMiddleware');
const { AuthMiddleware } = require('../middleware/authMiddleware');
const { requireScope } = require('../middleware/apiKeyMiddleware');

const apiRouter = require('express').Router();

const apiController = new ApiController();
const bidController = new BidController();

/**
 * @swagger
 * /api/client/dashboard:
 *   post:
 *     summary: Create a new Dashboard API client key
 *     description: Creates a dashboard API client for the authenticated user. The generated API key is returned only once in the response.
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
 *                 example: Dashboard Client
 *     responses:
 *       201:
 *         description: Dashboard API key created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dashboard API key created
 *                 apiKey:
 *                   type: string
 *                   example: 4f3a9b8d7c6e5f1234567890abcdef1234567890abcdef1234567890abcdef
 *                 scopes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - read:alumni
 *                     - read:analytics
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
apiRouter.post('/client/dashboard', AuthMiddleware.requireAuth, apiController.createDashboardClient);

/**
 * @swagger
 * /api/client/ar:
 *   post:
 *     summary: Create a new AR app API client key
 *     description: Creates an AR app API client for the authenticated user. The generated API key is returned only once in the response.
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
 *                 example: AR App Client
 *     responses:
 *       201:
 *         description: AR app API key created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AR app API key created
 *                 apiKey:
 *                   type: string
 *                   example: 8c2f1e7a9b6d5c1234567890abcdef1234567890abcdef1234567890abcdef
 *                 scopes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - read:alumni_of_day
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
apiRouter.post('/client/ar', AuthMiddleware.requireAuth, apiController.createArClient);

/**
 * @swagger
 * /api/winner:
 *   get:
 *     summary: Get today's featured alumnus
 *     description: Returns today's featured alumnus for clients with the read:alumni_of_day scope.
 *     tags: [Public API]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key issued for an AR app client
 *     responses:
 *       200:
 *         description: Winner retrieved successfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key, inactive API key, or insufficient permission
 */
apiRouter.get('/winner',ApiKeyMiddleware.requireApiKey,requireScope('read:alumni_of_day'),bidController.getWinnerPublic);

module.exports = { apiRouter };