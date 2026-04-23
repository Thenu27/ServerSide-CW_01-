const { AnalyticsService } = require('../services/analyticsService.js')

// Controller class to handle all analytics-related API requests
class AnalyticsController {

    constructor() {
        // Initialize AnalyticsService to access business logic
        this.analyticsService = new AnalyticsService()
    }

    // Get overall summary 
    getSummary = async (req, res, next) => {
        try {
            // Extract authenticated user ID from middleware
            const userId = req.user.userId

            // Call service layer to get summary data
            const summary = await this.analyticsService.summary(userId);

            // Send response
            res.status(200).json({
                summary,
                msg: "Summary Retrieved Succesfully"
            })
        } catch (err) {
            next(err) // Pass error to global error handler
        }
    }

    // Get count of alumni grouped by industry
    getIndustryCount = async (req, res, next) => {
        try {
            const userId = req.user.userId

            // Fetch industry distribution data
            const industryCount = await this.analyticsService.getIndustryCount(userId);

            res.status(200).json({
                industryCount,
                msg: "IndustryCount Retrieved Succesfully"
            })

        } catch (err) {
            next(err)
        }
    }

    // Get top certifications among alumni
    getTopCertification = async (req, res, next) => {
        try {
            const userId = req.user.userId

            // Fetch most common certifications
            const topCertification = await this.analyticsService.getTopCertification(userId);

            res.status(200).json({
                topCertification,
                msg: "topCertification Retrieved Succesfully"
            })

        } catch (err) {
            next(err)
        }
    }

    // Get top employers
    getTopEmployers = async (req, res, next) => {
        try {
            const userId = req.user.userId

            // Fetch most frequent employers
            const topEmployers = await this.analyticsService.getTopEmployers(userId);

            res.status(200).json({
                topEmployers,
                msg: "topEmployers Retrieved Succesfully"
            })

        } catch (err) {
            next(err)
        }
    }

    // Get top courses taken by alumni
    getTopCourses = async (req, res, next) => {
        try {
            const userId = req.user.userId

            // Fetch most common courses
            const topCourses = await this.analyticsService.getTopCourses(userId);

            res.status(200).json({
                topCourses,
                msg: "topCourses Retrieved Succesfully"
            })

        } catch (err) {
            next(err)
        }
    }

    // Get graduation year distribution
    getDegreeYear = async (req, res, next) => {
        try {
            const userId = req.user.userId

            // Fetch graduation year statistics
            const degreeYear = await this.analyticsService.getGraduateYear(userId);

            res.status(200).json({
                degreeYear,
                msg: "degreeYear Retrieved Succesfully"
            })

        } catch (err) {
            next(err)
        }
    }

    // Get most common degree names
    getDegreeName = async (req, res, next) => {
        try {
            const userId = req.user.userId

            // Fetch degree distribution
            const degreeName = await this.analyticsService.getDegree(userId);

            res.status(200).json({
                degreeName,
                msg: "degreeName Retrieved Succesfully"
            })

        } catch (err) {
            next(err)
        }
    }

    // Get most common job titles 
    getJobTitle = async (req, res, next) => {
        try {
            const userId = req.user.userId

            // Fetch job title distribution
            const jobTitle = await this.analyticsService.getCareer(userId);

            res.status(200).json({
                jobTitle,
                msg: "jobTitle Retrieved Succesfully"
            })

        } catch (err) {
            next(err)
        }
    }

    // Get skill gaps 
    getSkillGaps = async (req, res, next) => {
        try {
            const userId = req.user.userId

            // Fetch identified skill gaps
            const skillGaps = await this.analyticsService.getSkillGaps(userId);

            res.status(200).json({
                skillGaps,
                msg: "skillGaps Retrieved Succesfully"
            });

        } catch (error) {
            next(error);
        }
    };

}

module.exports = { AnalyticsController };