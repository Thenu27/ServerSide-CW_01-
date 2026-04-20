const express = require("express");
const { InsightsController } = require("../controllers/insightsController");

const  insightsRouter = express.Router();
const insightsController = new InsightsController();

insightsRouter.get("/",insightsController.getAllInsights);

module.exports = insightsRouter;