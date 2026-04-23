const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

// Service for course-related logic
class CourseService {

  constructor() {
    // Initialize usage logging service
    this.usageService = new UsageService();
  }

  // Add new course
  addCourse = async (userId, name, provider, year, url) => {

    // Find user profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        profileId: profile.id,
        name,
        provider,
        year,
        url
      },
    });

    // Log usage
    if (userId) {
      await this.usageService.usage({
        userId,
        action: "ADD_COURSE",
        endpoint: "/course",
        method: "POST"
      })
    }

    return course;
  };

  // Get courses for user
  getCourses = async (userId) => {

    // Find profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    // Fetch courses
    const courses = await prisma.course.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    if (!courses || courses.length === 0) {
      const error = new Error("No Courses Found");
      error.statusCode = 404;
      throw error
    }

    // Log usage
    if (userId) {
      await this.usageService.usage({
        userId,
        action: "GET_COURSE",
        endpoint: "/course",
        method: "GET"
      })
    }

    return courses;
  };

  // Delete course
  deleteCourse = async (userId, courseId) => {

    // Find profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    // Find course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      const error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (course.profileId !== profile.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    // Delete course
    await prisma.course.delete({
      where: { id: courseId },
    });

    // Log usage
    if (userId) {
      await this.usageService.usage({
        userId,
        action: "DELETE_COURSE",
        endpoint: `/course/${courseId}`,
        method: "DELETE",
      });
    }

    return { message: "Course deleted successfully" };
  };

  // Update course
  updateCourse = async (userId, courseId, name, provider, year, url) => {

    const parsedYear = Number(year); // Convert year to number

    // Validate input
    if (!name || !provider || year === undefined || year === null || !url) {
      const error = new Error("Name, provider, and year are required");
      error.statusCode = 400;
      throw error;
    }

    // Find profile
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    // Find course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.length === 0) {
      const error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }

    // Check ownership
    if (course.profileId !== profile.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        name,
        provider,
        year: parsedYear,
        url
      },
    });

    // Log usage
    await this.usageService.usage({
      userId,
      action: "UPDATE_COURSE",
      endpoint: `/course/${courseId}`,
      method: "PUT",
    });

    return updatedCourse;
  };

}

module.exports = { CourseService };