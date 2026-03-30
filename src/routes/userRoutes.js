const express = require('express');
const { UserController } = require('../controllers/userController');
const { AuthMiddleware } = require('../middleware/authMiddleware');
const userRouter = express.Router();

const userController = new UserController();
/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 */
userRouter.get('/me',AuthMiddleware.requireAuth,userController.me)


module.exports={userRouter} 