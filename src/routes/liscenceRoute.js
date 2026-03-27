const { LiscenceController } = require('../controllers/liscenceController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const liscenceRouter = require('express').Router();

const liscenceController = new LiscenceController()

liscenceRouter.post('/',AuthMiddleware.requireAuth,liscenceController.addLiscence)
liscenceRouter.get('/',AuthMiddleware.requireAuth,liscenceController.getLiscence)

module.exports={liscenceRouter}