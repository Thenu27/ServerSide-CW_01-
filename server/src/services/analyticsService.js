const { prisma } = require("../config/prisma");

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
    
    console.log("industryCount:",industryCount)
    return industryCount;
  };
}

module.exports = { AnalyticsService };