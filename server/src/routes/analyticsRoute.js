const { AnalyticsController } = require('../controllers/analyticsController');

const analyticsRoute = require('express').Router();

const analyticsController = new AnalyticsController()

analyticsRoute.get('/summary',analyticsController.getSummary)

module.exports={analyticsRoute}