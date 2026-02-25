const express = require('express');
const { UserController } = require('../controllers/userController');
const { AuthMiddleware } = require('../middleware/authMiddleware');
const userRouter = express.Router();

const userController = new UserController();

userRouter.get('/me',AuthMiddleware.requireAuth,userController.me)


module.exports={userRouter} 