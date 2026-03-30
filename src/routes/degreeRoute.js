const { DegreeController } = require('../controllers/degreeController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const degreeRouter = require('express').Router();
const degreeController = new DegreeController();

/**
 * @swagger
 * /degree:
 *   post:
 *     summary: Add degree
 *     tags: [Degree]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - degreeName
 *               - institution
 *               - year
 *             properties:
 *               degreeName:
 *                 type: string
 *                 example: BSc Software Engineering
 *               institution:
 *                 type: string
 *                 example: University of Westminster
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       201:
 *         description: Degree added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
degreeRouter.post('/',AuthMiddleware.requireAuth,degreeController.addDegree);

/**
 * @swagger
 * /degree:
 *   get:
 *     summary: Get user degrees
 *     tags: [Degree]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Degrees retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
degreeRouter.get('/',AuthMiddleware.requireAuth,degreeController.getDegree)

/**
 * @swagger
 * /degree/{id}:
 *   delete:
 *     summary: Delete degree
 *     tags: [Degree]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Degree ID
 *     responses:
 *       200:
 *         description: Degree deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Degree not found
 */
degreeRouter.delete('/:id', AuthMiddleware.requireAuth, degreeController.deleteDegree);

/**
 * @swagger
 * /degree/{id}:
 *   put:
 *     summary: Update degree
 *     tags: [Degree]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Degree ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - degreeName
 *               - institution
 *               - year
 *             properties:
 *               degreeName:
 *                 type: string
 *                 example: BSc Software Engineering
 *               institution:
 *                 type: string
 *                 example: University of Westminster
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       200:
 *         description: Degree updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Degree or profile not found
 */
degreeRouter.put('/:id', AuthMiddleware.requireAuth, degreeController.updateDegree);

module.exports={degreeRouter}