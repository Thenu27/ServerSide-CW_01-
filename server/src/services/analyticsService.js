const { prisma } = require("../config/prisma");

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
  summary = async () => {
    const totalAlumni = await prisma.profile.count();

    const topEmployerResult = await prisma.employmentHistory.groupBy({
      by: ["companyName"],
      _count: {
        companyName: true
      },
      orderBy: {
        _count: {
          companyName: "desc"
        }
      },
      take: 1
    });

    const topIndustryResult = await prisma.employmentHistory.groupBy({
      by: ["industrySector"],
      _count: {
        industrySector: true
      },
      orderBy: {
        _count: {
          industrySector: "desc"
        }
      },
      take: 1
    });

    const topCertificationResult = await prisma.certification.groupBy({
      by: ["name"],
      _count: {
        name: true
      },
      orderBy: {
        _count: {
          name: "desc"
        }
      },
      take: 1
    });

    const topIndustry = topIndustryResult[0]?.industrySector || "N/A";
    const topEmployer = topEmployerResult[0]?.companyName || "N/A";
    const topCertification = topCertificationResult[0]?.name || "N/A";

    return {
      totalAlumni,
      topIndustry,
      topEmployer,
      topCertification
    };
  };

  getIndustryCount = async () => {
    const industryData = await prisma.employmentHistory.groupBy({
      by: ["industrySector"],
      _count: {
        industrySector: true
      },
      orderBy: {
        _count: {
          industrySector: "desc"
        }
      }
    });

    const industryCount = industryData.map((item) => ({
      name: item.industrySector,
      value: item._count.industrySector
    }));
    
    return industryCount;
  };

  
  getTopCertification = async () => {
    const topCertificationData = await prisma.certification.groupBy({
      by: ["name"],
      _count: {
        name: true
      },
      orderBy: {
        _count: {
          name: "desc"
        }
      }
    });

    const topCertification = topCertificationData.map((item) => ({
      name: item.name,
      value: item._count.name
    }));
    
    console.log("topCertification:",topCertification)
    return topCertification;
  };

  getTopEmployers = async () => {
    const topEmployersData = await prisma.employmentHistory.groupBy({
      by: ["companyName"],
      _count: {
        companyName: true
      },
      orderBy: {
        _count: {
          companyName: "desc"
        }
      }
    });

    const topEmployers = topEmployersData.map((item) => ({
      name: item.companyName,
      value: item._count.companyName
    }));
    
    console.log("topEmployers:",topEmployers)
    return topEmployers;
  };

  getTopCourses = async () => {
    const topCoursesData = await prisma.course.groupBy({
      by: ["name"],
      _count: {
        name: true
      },
      orderBy: {
        _count: {
          name: "desc"
        }
      }
    });

    const topCourses = topCoursesData.map((item) => ({
      name: item.name,
      value: item._count.name
    }));
    
    console.log("topCourses:",topCourses)
    return topCourses;
  };

  getGraduateYear = async () => {
    const topGraduateYearData = await prisma.degree.groupBy({
      by: ["year"],
      _count: {
        year: true
      },
      orderBy: {
        _count: {
          year: "desc"
        }
      }
    });

    const topGraduateYear = topGraduateYearData.map((item) => ({
      year: item.year,
      value: item._count.year
    }));
    
    return topGraduateYear;
  };

  getDegree = async () => {
    const degreeNameData = await prisma.degree.groupBy({
      by: ["degreeName"],
      _count: {
        degreeName: true
      },
      orderBy: {
        _count: {
          degreeName: "desc"
        }
      }
    });

    const degreeName = degreeNameData.map((item) => ({
      name: item.degreeName,
      value: item._count.degreeName
    }));
    
    return degreeName;
  };

  getCareer = async () => {
    const jobTitleData = await prisma.employmentHistory.groupBy({
      by: ["jobTitle"],
      _count: {
        jobTitle: true
      },
      orderBy: {
        _count: {
          jobTitle: "desc"
        }
      }
    });

    const jobTitle = jobTitleData.map((item) => ({
      name: item.jobTitle,
      value: item._count.jobTitle
    }));
        console.log("jobTitleData:",jobTitleData)

    return jobTitle;
  };

  

  getSkillGaps = async () => {
    const profiles = await prisma.profile.findMany({
      include: {
        degrees: true,
        certifications: true,
        courses: true,
        licences: true
      }
    });

    const skillMaps = {};

    for (const profile of profiles) {
      if (!profile.degrees || profile.degrees.length === 0) {
        continue;
      }

      const gradYear = profile.degrees[0].year;
      const skills = new Set();

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

      for (const skill of skills) {
        if (!skill) continue;

        if (!skillMaps[skill]) {
          skillMaps[skill] = 0;
        }

        skillMaps[skill] += 1;
      }
    }

    return Object.entries(skillMaps)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

}

module.exports = { AnalyticsService };