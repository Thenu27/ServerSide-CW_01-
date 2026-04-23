const { CourseService } = require("../services/courseService");

// Controller for course-related operations
class CourseController {
  constructor() {
    // Initialize service
    this.courseService = new CourseService();
  }

  // Add new course
  addCourse = async (req, res, next) => {
    try {
      const { name, provider, year, url } = req.body; // Input data
      const userId = req.user.userId; // Logged-in user

      // Validate required fields
      if (!name || !provider || !year || !url) {
        return res.status(400).json({
          status: "error",
          message: "All fields (name, provider, year) are required",
        });
      }

      // Call service to add course
      const course = await this.courseService.addCourse(
        userId,
        name,
        provider,
        year,
        url
      );

      return res.status(201).json({
        status: "success",
        message: "Course added successfully",
        course,
      });
    } catch (err) {
      next(err);
    }
  }

  // Get courses for logged-in user
  getCourses = async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const courses = await this.courseService.getCourses(userId);

      return res.status(200).json({
        status: "success",
        courses,
      });
    } catch (err) {
      next(err);
    }
  };

  // Delete course
  deleteCourse = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params; // Course ID

      const result = await this.courseService.deleteCourse(userId, id);

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  };

  // Update course
  updateCourse = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params; // Course ID
      const { name, provider, year, url } = req.body;

      // Update course
      const course = await this.courseService.updateCourse(
        userId,
        id,
        name,
        provider,
        year,
        url
      );

      return res.status(200).json({
        status: "success",
        message: "Course updated successfully",
        course,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { CourseController };