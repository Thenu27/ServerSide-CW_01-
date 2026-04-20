const { InsightsService } = require("../services/insightsService");

class InsightsController {
  constructor() {
    this.insightsService = new InsightsService();
  }

  getAllInsights = async (req, res, next) => {
    try {
      const insights = await this.insightsService.getAllInsights();

      res.status(200).json({
        status: "success",
        message: "Insights retrieved successfully",
        insights,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { InsightsController };