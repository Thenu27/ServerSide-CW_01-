const { prisma } = require("../config/prisma");

class CourseService {
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

  return courses;
};



}

module.exports = { CourseService };