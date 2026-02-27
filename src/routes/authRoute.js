const express = require('express');
const { AuthController } = require('../controllers/authController');
const authRouter = express.Router();

const authController = new AuthController();


authRouter.post('/register',authController.register);
authRouter.post('/login',authController.login);
authRouter.post('/refresh',authController.refresh);
authRouter.post('/logout',authController.logout)

module.exports={authRouter} 