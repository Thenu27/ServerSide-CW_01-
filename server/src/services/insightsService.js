const { prisma } = require("../config/prisma");
const { AnalyticsService } = require("./analyticsService");

class InsightsService {
  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getTopCertification = async () => {
    const topCertification = await prisma.certification.groupBy({
      by: ["name"],
      _count: { name: true },
      orderBy: {
        _count: { name: "desc" },
      },
      take: 1,
    });

    return topCertification.length > 0
      ? topCertification[0].name
      : null;
  };

  getTopEmployer = async () => {
    const topEmployer = await prisma.employmentHistory.groupBy({
      by: ["companyName"],
      _count: { companyName: true },
      orderBy: {
        _count: { companyName: "desc" },
      },
      take: 1,
    });

    return topEmployer.length > 0
      ? topEmployer[0].companyName
      : null;
  };

  getTopIndustry = async () => {
    const topIndustry = await prisma.employmentHistory.groupBy({
      by: ["industrySector"],
      _count: { industrySector: true },
      orderBy: {
        _count: { industrySector: "desc" },
      },
      take: 1,
    });

    return topIndustry.length > 0
      ? topIndustry[0].industrySector
      : null;
  };

  getTopSkill = async () => {
    const skillData = await this.analyticsService.getSkillGaps();

    return skillData && skillData.length > 0
      ? skillData[0].name
      : null;
  };

  getAllInsights = async () => {
    const [
      mostCommonCertification,
      mostCommonEmployer,
      topIndustry,
      emergingSkill,
    ] = await Promise.all([
      this.getTopCertification(),
      this.getTopEmployer(),
      this.getTopIndustry(),
      this.getTopSkill(),
    ]);

    return {
      mostCommonCertification,
      mostCommonEmployer,
      topIndustry,
      emergingSkill,
    };
  };
}

module.exports = { InsightsService };