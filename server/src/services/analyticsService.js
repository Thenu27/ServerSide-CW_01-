const { prisma } = require("../config/prisma");
const { UsageService } = require("./usageService");

// Normalize skill names into standard labels
const normalizeSkillName = (name) => {
  if (!name) return null;

  const value = name.trim().toLowerCase();

  if (value.includes("aws")) return "AWS";
  if (value.includes("azure")) return "Azure";
  if (value.includes("gcp") || value.includes("google cloud")) return "GCP";
  if (value.includes("docker")) return "Docker";
  if (value.includes("kubernetes")) return "Kubernetes";
  if (value.includes("scrum") || value.includes("agile")) return "Agile / Scrum";
  if (value.includes("python")) return "Python";
  if (value.includes("sql")) return "SQL";
  if (value.includes("tableau")) return "Tableau";
  if (value.includes("power bi")) return "Power BI";

  return name.trim();
};

class AnalyticsService {

  constructor(){
    // Initialize usage logging service
    this.usageService = new UsageService()
  }

  // Get overall summary (counts + top values)
  summary = async (userId) => {
    const totalAlumni = await prisma.profile.count();

    // Get top employer
    const topEmployerResult = await prisma.employmentHistory.groupBy({
      by: ["companyName"],
      _count: { companyName: true },
      orderBy: { _count: { companyName: "desc" } },
      take: 1
    });

    // Get top industry
    const topIndustryResult = await prisma.employmentHistory.groupBy({
      by: ["industrySector"],
      _count: { industrySector: true },
      orderBy: { _count: { industrySector: "desc" } },
      take: 1
    });

    // Get top certification
    const topCertificationResult = await prisma.certification.groupBy({
      by: ["name"],
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
      take: 1
    });

    const topIndustry = topIndustryResult[0]?.industrySector || "N/A";
    const topEmployer = topEmployerResult[0]?.companyName || "N/A";
    const topCertification = topCertificationResult[0]?.name || "N/A";

    // Log usage
    if(userId){
        await this.usageService.usage({
          userId,
          action:"GET_SUMMARY",
          endpoint : "/analytics/summary",
          method : "GET"
        })
      }      

    return { totalAlumni, topIndustry, topEmployer, topCertification };
  };

  // Get industry distribution
  getIndustryCount = async (userId) => {
    const industryData = await prisma.employmentHistory.groupBy({
      by: ["industrySector"],
      _count: { industrySector: true },
      orderBy: { _count: { industrySector: "desc" } }
    });

    const industryCount = industryData.map((item) => ({
      name: item.industrySector,
      value: item._count.industrySector
    }));

    // Log usage
    if(userId){
        await this.usageService.usage({
          userId,
          action:"GET_INDUSTRY_SECTOR",
          endpoint : "/analytics/industry",
          method : "GET"
        })
      }    
    return industryCount;
  };

  // Get top certifications
  getTopCertification = async (userId) => {
    const topCertificationData = await prisma.certification.groupBy({
      by: ["name"],
      _count: { name: true },
      orderBy: { _count: { name: "desc" } }
    });

    const topCertification = topCertificationData.map((item) => ({
      name: item.name,
      value: item._count.name
    }));

    // Log usage
    if(userId){
        await this.usageService.usage({
          userId,
          action:"GET_TOP_CERTIFICATION",
          endpoint : "/analytics/certification",
          method : "GET"
        })
      } 
    return topCertification;
  };

  // Get top employers
  getTopEmployers = async (userId) => {
    const topEmployersData = await prisma.employmentHistory.groupBy({
      by: ["companyName"],
      _count: { companyName: true },
      orderBy: { _count: { companyName: "desc" } }
    });

    const topEmployers = topEmployersData.map((item) => ({
      name: item.companyName,
      value: item._count.companyName
    }));

    // Log usage
    if(userId){
        await this.usageService.usage({
          userId,
          action:"GET_TOP_EMPLOYERS",
          endpoint : "/analytics/employer",
          method : "GET"
        })
      }
    return topEmployers;
  };

  // Get top courses
  getTopCourses = async (userId) => {
    const topCoursesData = await prisma.course.groupBy({
      by: ["name"],
      _count: { name: true },
      orderBy: { _count: { name: "desc" } }
    });

    const topCourses = topCoursesData.map((item) => ({
      name: item.name,
      value: item._count.name
    }));

    // Log usage
    if(userId){
        await this.usageService.usage({
          userId,
          action:"GET_TOP_COURSES",
          endpoint : "/analytics/courses",
          method : "GET"
        })
      }    
    return topCourses;
  };

  // Get graduate year distribution
  getGraduateYear = async (userId) => {
    const topGraduateYearData = await prisma.degree.groupBy({
      by: ["year"],
      _count: { year: true },
      orderBy: { _count: { year: "desc" } }
    });

    const topGraduateYear = topGraduateYearData.map((item) => ({
      year: item.year,
      value: item._count.year
    }));

    // Log usage
    if(userId){
        await this.usageService.usage({
          userId,
          action:"GET_GRADUATE_YEAR",
          endpoint : "/analytics/degree-year",
          method : "GET"
        })
      }     
    return topGraduateYear;
  };

  // Get degree distribution
  getDegree = async (userId) => {
    const degreeNameData = await prisma.degree.groupBy({
      by: ["degreeName"],
      _count: { degreeName: true },
      orderBy: { _count: { degreeName: "desc" } }
    });

    const degreeName = degreeNameData.map((item) => ({
      name: item.degreeName,
      value: item._count.degreeName
    }));

    // Log usage
    if(userId){
        await this.usageService.usage({
          userId,
          action:"GET_DEGREE",
          endpoint : "/analytics/degreeName",
          method : "GET"
        })
    }

    return degreeName;
  };

  // Get job title distribution
  getCareer = async (userId) => {
    const jobTitleData = await prisma.employmentHistory.groupBy({
      by: ["jobTitle"],
      _count: { jobTitle: true },
      orderBy: { _count: { jobTitle: "desc" } }
    });

    const jobTitle = jobTitleData.map((item) => ({
      name: item.jobTitle,
      value: item._count.jobTitle
    }));

    // Log usage
    if(userId){
        await this.usageService.usage({
          userId,
          action:"GET_CAREER",
          endpoint : "/analytics/job-title",
          method : "GET"
        })
    }    

    return jobTitle;
  };

  // Identify top skill gaps
  getSkillGaps = async (userId) => {
    const profiles = await prisma.profile.findMany({
      include: {
        degrees: true,
        certifications: true,
        courses: true,
        licences: true
      }
    });

    const skillMaps = {};

    // Loop through profiles
    for (const profile of profiles) {
      if (!profile.degrees || profile.degrees.length === 0) continue;

      const gradYear = profile.degrees[0].year;
      const skills = new Set();

      // Collect skills after graduation
      for (const cert of profile.certifications) {
        if (cert.year > gradYear && cert.name) {
          skills.add(normalizeSkillName(cert.name));
        }
      }

      for (const course of profile.courses) {
        if (course.year > gradYear && course.name) {
          skills.add(normalizeSkillName(course.name));
        }
      }

      for (const licence of profile.licences) {
        if (licence.year > gradYear && licence.name) {
          skills.add(normalizeSkillName(licence.name));
        }
      }

      // Count occurrences
      for (const skill of skills) {
        if (!skill) continue;

        if (!skillMaps[skill]) {
          skillMaps[skill] = 0;
        }

        skillMaps[skill] += 1;
      }
    }

    // Log usage
    if(userId){
        await this.usageService.usage({
          userId,
          action:"GET_SKILL_GAPS",
          endpoint : "/analytics/skill-gaps",
          method : "GET"
        })
    } 

    // Return top 10 skill gaps
    return Object.entries(skillMaps)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

}

module.exports = { AnalyticsService };