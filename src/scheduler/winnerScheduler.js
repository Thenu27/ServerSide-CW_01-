const cron = require("node-cron");
const {BidService} = require('../services/bidService') 

const bidService = new BidService();

cron.schedule("0 0 * * *",async()=>{
    try{
        await bidService.selectWinner();
        console.log("Winner Selected")
    }catch(err){
        next(err)
    }
})