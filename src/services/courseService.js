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



}

module.exports = { CourseService };