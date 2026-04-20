const { EmploymentController } = require('../controllers/employmentController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const employmentRouter = require('express').Router();
const employmentController = new EmploymentController()

/**
 * @swagger
 * /employment:
 *   post:
 *     summary: Add employment history
 *     tags: [Employment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - jobTitle
 *               - startDate
 *               - industrySector
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: Google
 *               jobTitle:
 *                 type: string
 *                 example: Software Engineer
 *               startDate:
 *                 type: string
 *                 example: 2023-01-01
 *               endDate:
 *                 type: string
 *                 example: 2025-01-01
 *               description:
 *                 type: string
 *                 example: Worked on backend systems
 *               industrySector:
 *                 type: string
 *                 example: Technology
 *     responses:
 *       201:
 *         description: Employment history added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
employmentRouter.post('/',AuthMiddleware.requireAuth,employmentController.addEmployment);

/**
 * @swagger
 * /employment:
 *   get:
 *     summary: Get employment history
 *     tags: [Employment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employment history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
employmentRouter.get('/',AuthMiddleware.requireAuth,employmentController.getEmployment);

/**
 * @swagger
 * /employment/{id}:
 *   delete:
 *     summary: Delete employment history
 *     tags: [Employment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employment history ID
 *     responses:
 *       200:
 *         description: Employment history deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employment history not found
 */
employmentRouter.delete('/:id', AuthMiddleware.requireAuth, employmentController.deleteEmployment);
/**
 * @swagger
 * /employment/{id}:
 *   put:
 *     summary: Update employment history
 *     tags: [Employment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employment history ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - jobTitle
 *               - startDate
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: Google
 *               jobTitle:
 *                 type: string
 *                 example: Software Engineer
 *               startDate:
 *                 type: string
 *                 example: 2023-01-01
 *               endDate:
 *                 type: string
 *                 example: 2025-01-01
 *               description:
 *                 type: string
 *                 example: Worked on backend systems
 *     responses:
 *       200:
 *         description: Employment history updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Employment history or profile not found
 */
employmentRouter.put('/:id', AuthMiddleware.requireAuth, employmentController.updateEmployment);


module.exports={employmentRouter}