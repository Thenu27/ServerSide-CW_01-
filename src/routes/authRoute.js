const express = require('express');
const { AuthController } = require('../controllers/authController');
const authRouter = express.Router();

const authController = new AuthController();


authRouter.post('/register',authController.register);

module.exports={authRouter}