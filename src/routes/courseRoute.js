const { CourseController } = require('../controllers/courseController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const courseRouter = require('express').Router();
const courseController = new CourseController()

courseRouter.post('/',AuthMiddleware.requireAuth,courseController.addCourse);
courseRouter.get('/',AuthMiddleware.requireAuth,courseController.getCourses)

module.exports={courseRouter}