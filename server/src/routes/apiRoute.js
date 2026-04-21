const { ApiController } = require('../controllers/apiController');
const { BidController } = require('../controllers/bidController');
const { ApiKeyMiddleware } = require('../middleware/apiKeyMiddleware');
const { AuthMiddleware } = require('../middleware/authMiddleware');
const { requireScope } = require('../middleware/requireScope');

const apiRouter = require('express').Router();

const apiController = new ApiController();
const bidController = new BidController();

/**
 * @swagger
 * /api/client/dashboard:
 *   post:
 *     summary: Create a new Dashboard API client key
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
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
apiRouter.post('/client/dashboard',AuthMiddleware.requireAuth,apiController.createDashboardClient);
/**
 * @swagger
 * /api/client/ar:
 *   post:
 *     summary: Create a new Mobile AR App API client key
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
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
apiRouter.post('/client/ar',AuthMiddleware.requireAuth,apiController.createArClient);

/**
 * @swagger
 * /api/winner:
 *   get:
 *     summary: Get today's featured alumnus (AR app API)
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
 *         description: Invalid API key or insufficient permission
 */
apiRouter.get('/winner',ApiKeyMiddleware.requireApiKey,requireScope('read:alumni_of_day'),bidController.getWinnerPublic);

module.exports = { apiRouter };