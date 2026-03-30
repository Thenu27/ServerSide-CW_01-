const { LiscenceController } = require('../controllers/liscenceController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const liscenceRouter = require('express').Router();

const liscenceController = new LiscenceController()

/**
 * @swagger
 * /liscence:
 *   post:
 *     summary: Add licence
 *     tags: [Licence]
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
 *               - issuer
 *               - year
 *             properties:
 *               name:
 *                 type: string
 *                 example: AWS Certified Solutions Architect
 *               issuer:
 *                 type: string
 *                 example: Amazon Web Services (AWS)
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Licence added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
liscenceRouter.post('/',AuthMiddleware.requireAuth,liscenceController.addLiscence);

/**
 * @swagger
 * /liscence:
 *   get:
 *     summary: Get user licences
 *     tags: [Licence]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Licences retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
liscenceRouter.get('/',AuthMiddleware.requireAuth,liscenceController.getLiscence);


/**
 * @swagger
 * /liscence/{id}:
 *   delete:
 *     summary: Delete licence
 *     tags: [Licence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Licence ID
 *     responses:
 *       200:
 *         description: Licence deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Licence not found
 */
liscenceRouter.delete('/:id', AuthMiddleware.requireAuth, liscenceController.deleteLiscence);
/**
 * @swagger
 * /liscence/{id}:
 *   put:
 *     summary: Update licence
 *     tags: [Licence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Licence ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - issuer
 *               - year
 *             properties:
 *               name:
 *                 type: string
 *                 example: AWS Certified Solutions Architect
 *               issuer:
 *                 type: string
 *                 example: Amazon Web Services (AWS)
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Licence updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Licence or profile not found
 */
liscenceRouter.put('/:id', AuthMiddleware.requireAuth, liscenceController.updateLiscence);

module.exports={liscenceRouter}