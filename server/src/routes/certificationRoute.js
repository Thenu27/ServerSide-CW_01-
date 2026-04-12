const { CertificationController } = require('../controllers/certificationController');
const { AuthMiddleware } = require('../middleware/authMiddleware');

const certificationRouter = require('express').Router();

const certificationController = new CertificationController();


/**
 * @swagger
 * /certification:
 *   post:
 *     summary: Add certification
 *     tags: [Certification]
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
 *                 example: AWS Certified Developer
 *               issuer:
 *                 type: string
 *                 example: Amazon
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Certification added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
certificationRouter.post('/',AuthMiddleware.requireAuth,certificationController.addCertification);

/**
 * @swagger
 * /certification:
 *   get:
 *     summary: Get user certifications
 *     tags: [Certification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Certifications retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
certificationRouter.get('/',AuthMiddleware.requireAuth,certificationController.getCertification);

/**
 * @swagger
 * /certification/{id}:
 *   delete:
 *     summary: Delete certification
 *     tags: [Certification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Certification ID
 *     responses:
 *       200:
 *         description: Certification deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Certification not found
 */
certificationRouter.delete('/:id',AuthMiddleware.requireAuth,certificationController.deleteCertification);
/**
 * @swagger
 * /certification/{id}:
 *   put:
 *     summary: Update certification
 *     tags: [Certification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Certification ID
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
 *                 example: AWS Certified Developer
 *               issuer:
 *                 type: string
 *                 example: Amazon
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       201:
 *         description: Certification updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Certification or profile not found
 */
certificationRouter.put('/:id', AuthMiddleware.requireAuth, certificationController.updateCertification);

module.exports={certificationRouter}