const express = require('express');
const { AuthMiddleware } = require('../middleware/authMiddleware');
const { ProfileController } = require('../controllers/profileController');
const profileRouter = express.Router();

const profileController = new ProfileController();

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Create profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Test User
 *               bio:
 *                 type: string
 *                 example: Software engineer and alumni influencer.
 *               linkedIn:
 *                 type: string
 *                 example: https://www.linkedin.com/in/testuser
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/profile.jpg
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Profile already exists
 */
profileRouter.post('/',AuthMiddleware.requireAuth,profileController.createProfile)

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
profileRouter.get('/',AuthMiddleware.requireAuth,profileController.getProfile)

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Updated User
 *               bio:
 *                 type: string
 *                 example: Updated bio here.
 *               linkedIn:
 *                 type: string
 *                 example: https://www.linkedin.com/in/updateduser
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/newimage.jpg
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
profileRouter.put('/',AuthMiddleware.requireAuth,profileController.updateProfile);

/**
 * @swagger
 * /profile:
 *   delete:
 *     summary: Delete logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
profileRouter.delete('/', AuthMiddleware.requireAuth, profileController.deleteProfile);

module.exports={profileRouter}; 