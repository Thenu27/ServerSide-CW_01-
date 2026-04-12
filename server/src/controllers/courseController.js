const { CourseService } = require("../services/courseService");

class CourseController {
  constructor() {
    this.courseService = new CourseService();
  }

  addCourse = async (req, res, next) => {
    try {
      const { name, provider, year } = req.body;
      const userId = req.user.userId;

      const course = await this.courseService.addCourse(
        userId,
        name,
        provider,
        year
      );

      return res.status(201).json({
        status: "success",
        message: "Course added successfully",
        course,
      });
    } catch (err) {
      next(err);
    }
  };

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


  deleteCourse = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const result = await this.courseService.deleteCourse(userId, id);

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  };

      updateCourse = async (req, res, next) => {
        try {
          const userId = req.user.userId;
          const { id } = req.params;
          const { name, provider, year } = req.body;

          const course = await this.courseService.updateCourse(
            userId,
            id,
            name,
            provider,
            year
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