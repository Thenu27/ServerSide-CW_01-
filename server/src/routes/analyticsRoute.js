const { AnalyticsController } = require('../controllers/analyticsController');

const analyticsRoute = require('express').Router();

const analyticsController = new AnalyticsController()

analyticsRoute.get('/summary',analyticsController.getSummary)
analyticsRoute.get('/industry',analyticsController.getIndustryCount)
analyticsRoute.get('/certification',analyticsController.getTopCertification)
analyticsRoute.get('/employer',analyticsController.getTopEmployers)
analyticsRoute.get('/courses',analyticsController.getTopCourses)
analyticsRoute.get('/degree-year',analyticsController.getDegreeYear)
analyticsRoute.get('/degreeName',analyticsController.getDegreeName)
analyticsRoute.get('/job-title',analyticsController.getJobTitle);
analyticsRoute.get("/skill-gaps", analyticsController.getSkillGaps);


module.exports={analyticsRoute}