const { EmploymentController } = require('../controllers/employmentController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const employmentRouter = require('express').Router();
const employmentController = new EmploymentController()

employmentRouter.post('/',AuthMiddleware.requireAuth,employmentController.addEmployment);
employmentRouter.get('/',AuthMiddleware.requireAuth,employmentController.getEmployment);

module.exports={employmentRouter}