const { ApiController } = require('../controllers/apiController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const apiRouter = require('express').Router();

const apiController = new ApiController()

apiRouter.get('/client',AuthMiddleware.requireAuth,apiController.createClient);

module.exports={apiRouter}