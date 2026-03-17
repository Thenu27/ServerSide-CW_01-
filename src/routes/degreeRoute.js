const { DegreeController } = require('../controllers/degreeController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const degreeRouter = require('express').Router();
const degreeController = new DegreeController();


degreeRouter.post('/',AuthMiddleware.requireAuth,degreeController.addDegree);
degreeRouter.get('/',AuthMiddleware.requireAuth,degreeController.getDegree)

module.exports={degreeRouter}