const { InsightsService } = require("../services/insightsService");

// Controller for insights-related operations
class InsightsController {
  constructor() {
    // Initialize service
    this.insightsService = new InsightsService();
  }

  // Get all insights
  getAllInsights = async (req, res, next) => {
    try {
      // Fetch insights from service
      const insights = await this.insightsService.getAllInsights();

      res.status(200).json({
        status: "success",
        message: "Insights retrieved successfully",
        insights,
      });
    } catch (err) {
      next(err); // Handle error
    }
  };
}

module.exports = { InsightsController };