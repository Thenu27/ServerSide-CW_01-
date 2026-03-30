const { BidService } = require("../services/bidService")

class BidController{
    constructor(){
        this.bidService = new BidService();
    }

    placeBid = async(req,res,next)=>{
        try{
            const {amount} = req.body;
            const userId = req.user.userId;

            const bid = await this.bidService.placeBid(userId,amount)

            res.status(201).json({
                status:"Success",
                message: "Bid placed successfully",
                bid
            })

        }catch(err){
            next(err)
        }


    }

    getBid =  async(req,res,next)=>{
        try{
            const userId = req.user.userId;

            const bid = await this.bidService.getMyBid(userId);

            res.status(200).json({
                status:"Success",
                bid
            })
        }catch(err){
            next(err)
        }
    }

    selectWinner = async(req,res,next)=>{
        try{

            const userId = req.user.userId
            const result = await this.bidService.selectWinner(userId);

            res.status(200).json({
                status:"Success",
                result
            })
        }catch(err){
            next(err)
        }
    }

    getWinner = async(req,res,next)=>{
        try{
            const userId = req.user.userId
            const winner = await this.bidService.getCurrentWinner(userId);

            res.status(200).json({
                status : "Success",
                winner
            })
        }catch(err){
            next(err)
        }
    }

    getWinnerPublic = async(req,res,next)=>{
        try{
            const winner = await this.bidService.getWinnerpublic();

            res.status(200).json({
                status : "Success",
                winner
            })
        }catch(err){
            next(err)
        }
    }
    getMyResult = async(req,res,next)=>{
        try{
            const userId = req.user.userId;
            const result = await this.bidService.getMyResult(userId);
            
            res.status(200).json({
                status : "Success",
                result
            })
        }catch(err){
            next(err)
        }
    }


    cancelBid = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const result = await this.bidService.cancelBid(userId);

            res.status(200).json({
                status: "success",
                message: result.message,
                data: result.bid
            });
        } catch (error) {
            next(error);
        }
    };

}

module.exports={BidController}