const cron = require("node-cron");
const { BidService } = require('../services/bidService') 

// Initialize service
const bidService = new BidService();

// Schedule task to run every day at midnight
cron.schedule("0 0 * * *", async () => {
    try {
        // Select winner automatically
        await bidService.selectWinner();

        // console.log("Winner Selected")
    } catch (err) {
        // Handle error
        console.error("Error selecting winner:", err);
    }
})