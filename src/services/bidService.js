const { BidStatus } = require("@prisma/client");
const { prisma } = require("../config/prisma");
const {normalizeDate} = require('../utils/date');
const { NotificationService } = require("./notificationService");
const { UsageService } = require("./usageService");


class BidService{

    constructor(){
        this.usageService = new UsageService();
        this.notificationService = new NotificationService();

    }

    placeBid = async (userId, amount) => {

        const profile = await prisma.profile.findUnique({
          where: { userId },
        });

        if (!profile) {
          const error = new Error("Profile not found");
          error.statusCode = 404;
          throw error;
        }


        if (!amount || amount <= 0) {
            const error = new Error("Invalid Amount!");
            error.statusCode = 400;
            throw error;
        }

        const bidDate = normalizeDate();
        let savedBid;

        const existingBid = await prisma.bid.findUnique({
            where: {
                userId_bidDate: {
                    userId,
                    bidDate
                }
            }
        });

        if (!existingBid) {
            savedBid = await prisma.bid.create({
                data: {
                    userId,
                    amount,
                    bidDate,
                    status: BidStatus.ACTIVE
                }
            });
        } else if (existingBid.status === "CANCELLED") {
            savedBid = await prisma.bid.update({
                where: {
                    userId_bidDate: { userId, bidDate }
                },
                data: {
                    amount,
                    status: BidStatus.ACTIVE
                }
            });
        } else {
            if (amount <= existingBid.amount) {
                const error = new Error("New bid must be higher than previous bid");
                error.statusCode = 400;
                throw error;
            }

            savedBid = await prisma.bid.update({
                where: {
                    userId_bidDate: {
                        userId,
                        bidDate
                    }
                },
                data: {
                    amount
                }
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        await this.notificationService.sendBidPlacedEmail({
            to: user.email,
            date: bidDate,
            amount: amount
        });

        await this.usageService.usage({
            userId: userId,
            action: "PLACE_BID",
            endpoint: "/bid",
            method: "POST"
        });

        return savedBid;
    };


    getMyBid = async (userId) => {


    const bidDate = normalizeDate();

    const bid = await prisma.bid.findFirst({
        where: {
            userId,
            bidDate,
            status: BidStatus.ACTIVE
        }
    });

    if (!bid) {
        const error = new Error("No bid found for this date");
        error.statusCode = 404;
        throw error;
    }

    if(userId){
        await this.usageService.usage({
            userId : userId,
            action:"GET_BID",
            endpoint : "/bid",
            method : "GET"
        })
    }
      return bid;
    };


    changeBidStatus = async(winnerUserId,date)=>{

            const statusWin = await prisma.bid.update({
                where: {
                    userId_bidDate: {
                        userId: winnerUserId,
                        bidDate: date
                    }
                },
                data: {
                    status: BidStatus.WIN
                }
            });

            const userWin = await prisma.user.findUnique({
                where:{id:winnerUserId}
            })

            if (!userWin || !userWin.email) {
                const error = new Error("Winner user not found");
                error.statusCode = 404
                throw error
            }


            await this.notificationService.sendWinnerEmail({
                to: userWin.email, date:date

            })

            const loserBids = await prisma.bid.findMany({
                    where: {
                        bidDate: date,
                        userId: {
                            not: winnerUserId
                        },
                        status: BidStatus.ACTIVE
                    },
                    include: {
                        user: true
                    }
                });

                console.log("loserBids:",loserBids)

                const statusLose = await prisma.bid.updateMany({
                    where: {
                        bidDate: date,
                        userId: {
                            not: winnerUserId
                        },
                        status: BidStatus.ACTIVE
                    },
                    data: {
                        status: BidStatus.LOSE
                    }
                });

                console.log("statusLose:",statusLose)

                const uniqueEmails = [...new Set(loserBids.map(bid => bid.user.email))];

                for (const email of uniqueEmails) {
                    await this.notificationService.sendLoserEmail({
                        to: email,
                        date
                    });
                }

                return {
                    winnerUpdated: 1,
                    losersUpdated: statusLose.count
                };

            }

    selectWinner = async (userId) => {
           const date = normalizeDate();

            const existingWinner = await prisma.featuredAlumnus.findUnique({
                where: { date },
            });

            if (existingWinner) {
                const error = new Error("Winner already selected for today");
                error.statusCode = 400;
                throw error;
            }

            const bids = await prisma.bid.findMany({
                where: { bidDate: date, status: BidStatus.ACTIVE },
                                orderBy: { amount: "desc" },
            });

            if (bids.length === 0) {
                const error = new Error("No bids found for today");
                error.statusCode = 404;
                throw error;
            }

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
            );

            let winnerUserId = null;
            let bonusEventRow = null;
            let selectedWinCount = 0;

            for (const bid of bids) {
                const winCount = await prisma.featuredAlumnus.count({
                where: {
                    userId: bid.userId,
                    date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                    },
                },
                });

                const eventParticipation = await prisma.alumniEventParticipation.findFirst({
                where: {
                    userId: bid.userId,
                    bonusUsed: false,
                    eventDate: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                    },
                },
                orderBy: {
                    eventDate: "asc",
                },
                });

                const limit = eventParticipation ? 4 : 3;

                if (winCount < limit) {
                winnerUserId = bid.userId;
                selectedWinCount = winCount;

                // store event row only if this win will become the 4th win
                if (winCount === 3 && eventParticipation) {
                    bonusEventRow = eventParticipation;
                }

                break;
                }
            }

            if (!winnerUserId) {
                const error = new Error("No eligible winner found for today");
                error.statusCode = 400;
                throw error;
            }

            const winner = await prisma.featuredAlumnus.create({
                data: {
                userId: winnerUserId,
                date,
                },
            });

            if(winner){
                await this.changeBidStatus(winnerUserId,date);
            }

            if (selectedWinCount === 3 && bonusEventRow) {
                await prisma.alumniEventParticipation.update({
                where: {
                    id: bonusEventRow.id,
                },
                data: {
                    bonusUsed: true,
                },
                });
            }

            if(userId){
                await this.usageService.usage({
                    userId : userId,
                    action:"SELECT_WINNER",
                    endpoint : "/bid/winner",
                    method : "POST"
                })
            }

            return winner;
    };

    getCurrentWinner = async (userId) => {
        const date = normalizeDate();

        const winner = await prisma.featuredAlumnus.findUnique({
            where: { date },
            include: {
            user: {
                include: {
                profile: true,
                },
            },
            },
        });

        if (!winner) {
            const error = new Error("No featured alumnus found for today!");
            error.statusCode = 404;
            throw error;
        }

        if(userId){
            await this.usageService.usage({
               userId : userId,
               action:"GET_WINNER",
               endpoint : "/bid/winner",
               method : "GET"
           })
        }    

        return winner;
        };


     getWinnerpublic = async () => {
        const date = normalizeDate();

        const winner = await prisma.featuredAlumnus.findUnique({
            where: { date },
            include: {
            user: {
                include: {
                profile: true,
                },
            },
            },
        });

        if (!winner) {
            const error = new Error("No featured alumnus found for today!");
            error.statusCode = 404;
            throw error;
        }

        return winner;
        };       


        getMyResult = async(userId)=>{
            const date = normalizeDate()

            const winner = await prisma.featuredAlumnus.findUnique({
                where : {date}
            })

            if(!winner){
                return{
                    status : BidStatus.PENDING,
                    messages : "Winner has not been selected yet."
                }
            }

            if(userId){
                await this.usageService.usage({
                userId : userId,
                action:"GET_MY_RESULT",
                endpoint : "/bid/result",
                method : "GET"
             })
          }  


            if(winner.userId === userId){
                return{
                    status: BidStatus.WIN,
                    messages : "Congratulations! You are today's winner."
                }
            }else{
                return{
                   status: BidStatus.LOSE,
                   messages : "Sorry, you were not selected today."
                }               
            }           

        }

        cancelBid = async (userId) => {
            const bidDate = normalizeDate();

            const bid = await prisma.bid.findUnique({
                where: {
                    userId_bidDate: {
                        userId,
                        bidDate
                    }
                }
            });

            if (!bid) {
                const error = new Error("No bid found for today");
                error.statusCode = 404;
                throw error;
            }

            if (bid.status === BidStatus.CANCELLED) {
                const error = new Error("Bid already cancelled");
                error.statusCode = 400;
                throw error;
            }

            const cancelledBid = await prisma.bid.update({
                where: {
                    userId_bidDate: {
                        userId,
                        bidDate
                    }
                },
                data: {
                    status: BidStatus.CANCELLED
                }
            });

            const user = await prisma.user.findUnique({
                where:{
                    id:userId
                }
            })

            await this.notificationService.sendCancelEmail({
                to:user.email,date:bidDate
            })

            if (userId) {
                await this.usageService.usage({
                    userId: userId,
                    action: "CANCEL_BID",
                    endpoint: "/bid",
                    method: "DELETE"
                });
            }

            return {
                message: "Bid cancelled successfully",
                bid: cancelledBid
            };
        };



}

module.exports = {BidService}

