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

            res.status(200).json({
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
            const winner = await this.bidService.selectWinner();

            res.status(200).json({
                status:"Success",
                winner
            })
        }catch(err){
            next(err)
        }
    }

    getWinner = async(req,res,next)=>{
        try{
            const winner = await this.bidService.getCurrentWinner();

            res.status(200).json({
                status : "Success",
                winner
            })
        }catch(err){
            next(err)
        }
    }

}

module.exports={BidController}