const { AnalyticsController } = require('../controllers/analyticsController');
const { ApiKeyMiddleware,requireScope } = require('../middleware/apiKeyMiddleware');

const analyticsRoute = require('express').Router();

const analyticsController = new AnalyticsController();

analyticsRoute.use(ApiKeyMiddleware.requireApiKey);
analyticsRoute.use(requireScope("read:analytics"));

/**
 * @swagger
 * /analytics/summary:
 *   get:
 *     summary: Get analytics summary
 *     description: Returns total alumni count, top industry, top employer, and top certification.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalAlumni:
 *                       type: integer
 *                       example: 120
 *                     topIndustry:
 *                       type: string
 *                       example: Software Engineering
 *                     topEmployer:
 *                       type: string
 *                       example: WSO2
 *                     topCertification:
 *                       type: string
 *                       example: AWS Certified Cloud Practitioner
 *                 msg:
 *                   type: string
 *                   example: Summary Retrieved Succesfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key or insufficient permissions
 */
analyticsRoute.get('/summary',analyticsController.getSummary)

/**
 * @swagger
 * /analytics/industry:
 *   get:
 *     summary: Get industry distribution
 *     description: Returns alumni counts grouped by industry sector.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Industry count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 industryCount:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: IT
 *                       value:
 *                         type: integer
 *                         example: 35
 *                 msg:
 *                   type: string
 *                   example: IndustryCount Retrieved Succesfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key or insufficient permissions
 */
analyticsRoute.get('/industry',analyticsController.getIndustryCount)

/**
 * @swagger
 * /analytics/certification:
 *   get:
 *     summary: Get top certifications
 *     description: Returns certification counts grouped by certification name.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Top certifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topCertification:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: AWS Certified Cloud Practitioner
 *                       value:
 *                         type: integer
 *                         example: 18
 *                 msg:
 *                   type: string
 *                   example: topCertification Retrieved Succesfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key or insufficient permissions
 */
analyticsRoute.get('/certification',analyticsController.getTopCertification)

/**
 * @swagger
 * /analytics/employer:
 *   get:
 *     summary: Get top employers
 *     description: Returns employer counts grouped by company name.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Top employers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topEmployers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Sysco LABS
 *                       value:
 *                         type: integer
 *                         example: 22
 *                 msg:
 *                   type: string
 *                   example: topEmployers Retrieved Succesfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key or insufficient permissions
 */
analyticsRoute.get('/employer',analyticsController.getTopEmployers)

/**
 * @swagger
 * /analytics/courses:
 *   get:
 *     summary: Get top courses
 *     description: Returns course counts grouped by course name.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Top courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topCourses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: React Fundamentals
 *                       value:
 *                         type: integer
 *                         example: 14
 *                 msg:
 *                   type: string
 *                   example: topCourses Retrieved Succesfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key or insufficient permissions
 */
analyticsRoute.get('/courses',analyticsController.getTopCourses)

/**
 * @swagger
 * /analytics/degree-year:
 *   get:
 *     summary: Get graduate year distribution
 *     description: Returns alumni counts grouped by graduation year.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Degree year retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 degreeYear:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: integer
 *                         example: 2024
 *                       value:
 *                         type: integer
 *                         example: 30
 *                 msg:
 *                   type: string
 *                   example: degreeYear Retrieved Succesfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key or insufficient permissions
 */
analyticsRoute.get('/degree-year',analyticsController.getDegreeYear)

/**
 * @swagger
 * /analytics/degreeName:
 *   get:
 *     summary: Get degree name distribution
 *     description: Returns alumni counts grouped by degree name.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Degree names retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 degreeName:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: BSc Software Engineering
 *                       value:
 *                         type: integer
 *                         example: 28
 *                 msg:
 *                   type: string
 *                   example: degreeName Retrieved Succesfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key or insufficient permissions
 */
analyticsRoute.get('/degreeName',analyticsController.getDegreeName)

/**
 * @swagger
 * /analytics/job-title:
 *   get:
 *     summary: Get job title distribution
 *     description: Returns alumni counts grouped by job title.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Job titles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobTitle:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Software Engineer
 *                       value:
 *                         type: integer
 *                         example: 26
 *                 msg:
 *                   type: string
 *                   example: jobTitle Retrieved Succesfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key or insufficient permissions
 */
analyticsRoute.get('/job-title',analyticsController.getJobTitle);

/**
 * @swagger
 * /analytics/skill-gaps:
 *   get:
 *     summary: Get top skill gaps
 *     description: Returns the top 10 normalized skills obtained after graduation based on certifications, courses, and licences.
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Skill gaps retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 skillGaps:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: AWS
 *                       value:
 *                         type: integer
 *                         example: 12
 *                 msg:
 *                   type: string
 *                   example: skillGaps Retrieved Succesfully
 *       401:
 *         description: API key required
 *       403:
 *         description: Invalid API key or insufficient permissions
 */
analyticsRoute.get("/skill-gaps", analyticsController.getSkillGaps);

module.exports={analyticsRoute}