const { CourseController } = require('../controllers/courseController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const courseRouter = require('express').Router();
const courseController = new CourseController()

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Add course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - provider
 *               - year
 *             properties:
 *               name:
 *                 type: string
 *                 example: Full Stack Web Development
 *               provider:
 *                 type: string
 *                 example: Coursera
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       201:
 *         description: Course added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
courseRouter.post('/',AuthMiddleware.requireAuth,courseController.addCourse);

/**
 * @swagger
 * /course:
 *   get:
 *     summary: Get user courses
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
courseRouter.get('/',AuthMiddleware.requireAuth,courseController.getCourses)

/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: Delete course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 */
courseRouter.delete('/:id',AuthMiddleware.requireAuth,courseController.deleteCourse);

/**
 * @swagger
 * /course/{id}:
 *   put:
 *     summary: Update course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - provider
 *               - year
 *             properties:
 *               name:
 *                 type: string
 *                 example: Full Stack Web Development
 *               provider:
 *                 type: string
 *                 example: Coursera
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       201:
 *         description: Course updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course or profile not found
 */
courseRouter.put('/:id', AuthMiddleware.requireAuth, courseController.updateCourse);




module.exports={courseRouter}