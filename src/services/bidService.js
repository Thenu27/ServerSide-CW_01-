const { prisma } = require("../config/prisma");
const {normalizeDate} = require('../utils/date');
const { UsageService } = require("./usageService");

class BidService{

    constructor(){
        this.usageService = new UsageService();
    }

    placeBid = async(userId,amount)=>{
        if(amount<=0 || !amount){
            const error = new Error('Invalid Amount!');
            error.statusCode = 400;
            throw error
        }

        const bidDate = normalizeDate();

        const existingBid = await prisma.bid.findUnique({
        where: {
            userId_bidDate: {
            userId,
            bidDate
            }
        }
        })

        if(!existingBid){
            const bid = await prisma.bid.create({
                data:{
                    userId,amount,bidDate
                }
            })

            return bid
        }

        if(amount <= existingBid.amount){
            const error = new Error('New bid must be higher than previous bid');
            error.statusCode = 400;
            throw error
        }

        const updateBid = await prisma.bid.update({
        where: {
            userId_bidDate: {
            userId,
            bidDate
            }
        },
        data: {
            amount
        }
        })

        if(userId){
            await this.usageService.usage({
                userId : user.id,
                action:"PLACE_BID",
                endpoint : "/bid",
                method : "POST"
            })
        }

            return updateBid

    }


    getMyBid = async (userId) => {


    const bidDate = normalizeDate();

    const bid = await prisma.bid.findUnique({
        where: {
        userId_bidDate: {
            userId,
            bidDate
        },
        },
    });

    if (!bid) {
        const error = new Error("No bid found for this month");
        error.statusCode = 404;
        throw error;
    }

    if(userId){
        await this.usageService.usage({
            userId : user.id,
            action:"GET_BID",
            endpoint : "/bid",
            method : "GET"
        })
    }
    return bid;
    };


    selectWinner = async (userId) => {
            const date = normalizeDate();

            // 1) Check if winner already exists for today
            const existingWinner = await prisma.featuredAlumnus.findUnique({
                where: { date },
            });

            if (existingWinner) {
                const error = new Error("Winner already selected for today");
                error.statusCode = 400;
                throw error;
            }

            // 2) Get all bids for today ordered from highest to lowest
            const bids = await prisma.bid.findMany({
                where: { bidDate: date },
                orderBy: { amount: "desc" },
            });

            if (bids.length === 0) {
                const error = new Error("No bids found for today");
                error.statusCode = 404;
                throw error;
            }

            // 3) Current month range
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

            // 4) Check each bidder from highest to lowest
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

            // 5) Create winner row
            const winner = await prisma.featuredAlumnus.create({
                data: {
                userId: winnerUserId,
                date,
                },
            });

            // 6) If this was the 4th win, mark the bonus event as used
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


        getMyResult = async(userId)=>{
            const date = normalizeDate()

            const winner = await prisma.featuredAlumnus.findUnique({
                where : {date}
            })

            if(!winner){
                return{
                    status : "PENDING",
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
                    status : "WIN",
                    messages : "Congratulations! You are today's winner."
                }
            }else{
                return{
                   status : "LOSE",
                   messages : "Sorry, you were not selected today."
                }               
            }



            

        }


}

module.exports = {BidService}

