const express = require('express');
const { AuthMiddleware } = require('../middleware/authMiddleware');
const { ProfileController } = require('../controllers/profileController');
const profileRouter = express.Router();

const profileController = new ProfileController();

profileRouter.post('/',AuthMiddleware.requireAuth,profileController.createProfile)
profileRouter.get('/',AuthMiddleware.requireAuth,profileController.getProfile)
profileRouter.put('/',AuthMiddleware.requireAuth,profileController.updateProfile)

module.exports={profileRouter} 