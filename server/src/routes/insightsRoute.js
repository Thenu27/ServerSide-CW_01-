const express = require("express");
const { InsightsController } = require("../controllers/insightsController");
const { ApiKeyMiddleware, requireScope } = require("../middleware/apiKeyMiddleware");

const  insightsRouter = express.Router();
const insightsController = new InsightsController();
insightsRouter.use(ApiKeyMiddleware.requireApiKey);
insightsRouter.use(requireScope("read:analytics"));

/**
 * @swagger
 * /key-insights:
 *   get:
 *     summary: Get key alumni insights
 *     description: Returns the most common certification, most common employer, top industry, and top emerging skill.
 *     tags: [Insights]
 *     responses:
 *       200:
 *         description: Insights retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Insights retrieved successfully
 *                 insights:
 *                   type: object
 *                   properties:
 *                     mostCommonCertification:
 *                       type: string
 *                       nullable: true
 *                       example: AWS Certified Cloud Practitioner
 *                     mostCommonEmployer:
 *                       type: string
 *                       nullable: true
 *                       example: WSO2
 *                     topIndustry:
 *                       type: string
 *                       nullable: true
 *                       example: Information Technology
 *                     emergingSkill:
 *                       type: string
 *                       nullable: true
 *                       example: Docker
 *       500:
 *         description: Internal server error
 */
insightsRouter.get("/",insightsController.getAllInsights);

module.exports = insightsRouter;