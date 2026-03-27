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

  
}

module.exports = { CourseController };