const { prisma } = require("../config/prisma");

class AnalyticsService {
  summary = async () => {
    console.log("Analysi")
    const totalAlumni = await prisma.profile.count();

    const topEmployerResult = await prisma.employmentHistory.groupBy({
        by:["companyName"],
        _count:{
            companyName : true
        },
        orderBy:{
            _count:{
                companyName:"desc"
            }
        },
        take: 1
    });

    const topIndustryResult = await prisma.employmentHistory.groupBy({
      by: ["industrySector"],
      _count: {
        industrySector: true,
      },
      orderBy: {
        _count: {
          industrySector: "desc",
        },
      },
      take: 1,
    });


    const topCertificationResult = await prisma.certification.groupBy({
      by: ["name"],
      _count: {
        name: true,
      },
      orderBy: {
        _count: {
          name: "desc",
        },
      },
      take: 1,
    });

    const topIndustry = topIndustryResult[0]?.industrySector || "N/A";
    const topEmployer = topEmployerResult[0]?.companyName || "N/A";
    const topCertification = topCertificationResult[0]?.name || "N/A";
    
    console.log("topIndistry:",topIndustry)
      const summary = {
        totalAlumni,
        topIndustry,
        topEmployer,
        topCertification
      };   

      console.log("summary:",summary)
      return summary
    
  };
}

module.exports={AnalyticsService}