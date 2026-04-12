const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

class CourseService {

  constructor(){
    this.usageService = new UsageService();
  }

  addCourse = async (userId, name, provider, year) => {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    const course = await prisma.course.create({
      data: {
        profileId: profile.id,
        name,
        provider,
        year,
      },
    });


    if(userId){
        await this.usageService.usage({
          userId : userId,
          action:"ADD_COURSE",
          endpoint : "/course",
          method : "POST"
        })
    }       

    return course;
  };

  
  getCourses = async (userId) => {

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    const courses = await prisma.course.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    if(!courses || courses.length === 0){
      const error = new Error("No Courses Found");
      error.statusCode = 404;
      throw error
    }

    if(userId){
        await this.usageService.usage({
          userId : userId,
          action:"GET_COURSE",
          endpoint : "/course",
          method : "GET"
        })
    }  



    return courses;
};

  deleteCourse = async (userId, courseId) => {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      const error = new Error("Course not found");
      error.statusCode = 404;
      throw error;
    }

    if (course.profileId !== profile.id) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    if (userId) {
      await this.usageService.usage({
        userId: userId,
        action: "DELETE_COURSE",
        endpoint: `/course/${courseId}`,
        method: "DELETE",
      });
    }

    return { message: "Course deleted successfully" };
  };



    updateCourse = async (userId, courseId, name, provider, year) => {
        const parsedYear = Number(year);

        if (!name || !provider || year === undefined || year === null) {
          const error = new Error("Name, provider, and year are required");
          error.statusCode = 400;
          throw error;
        }

        const profile = await prisma.profile.findUnique({
          where: { userId },
        });

        if (!profile) {
          const error = new Error("Profile not found");
          error.statusCode = 404;
          throw error;
        }

        const course = await prisma.course.findUnique({
          where: { id: courseId },
        });

        if (!course || course.length===0) {
          const error = new Error("Course not found");
          error.statusCode = 404;
          throw error;
        }

        if (course.profileId !== profile.id) {
          const error = new Error("Forbidden");
          error.statusCode = 403;
          throw error;
        }

        const updatedCourse = await prisma.course.update({
          where: { id: courseId },
          data: {
            name,
            provider,
            year: parsedYear,
          },
        });

        await this.usageService.usage({
          userId: userId,
          action: "UPDATE_COURSE",
          endpoint: `/course/${courseId}`,
          method: "PUT",
        });

        return updatedCourse;
  };


}

module.exports = { CourseService };