const {sendEmail} = require('../utils/sendMail')

class NotificationService {

    sendWinnerEmail = async ({ to, date }) => {
        await sendEmail({
            to,
            subject: "You won Alumni of the Day",
            html: `
                <h2>Congratulations 🎉</h2>
                <p>You won today's bidding round.</p>
                <p>Your profile will be featured.</p>
            `
        });

        return true;
    };

    sendLoserEmail = async ({ to, date }) => {
        await sendEmail({
            to,
            subject: "Bid result update",
            html: `
                <h3>Thank you for participating</h3>
                <p>Your bid for ${date} was not selected this time.</p>
            `
        });

        return true;
    };

    sendCancelEmail = async ({ to, date }) => {

        await sendEmail({
            to,
            subject: "Bid cancelled",
            html: `
                <p>Your bid for <strong>${date}</strong> has been cancelled.</p>
            `
        });

        return true;
    };

    sendBidPlacedEmail = async ({ to, date, amount }) => {

        await sendEmail({
            to,
            subject: "Bid placed successfully",
            html: `
                <h3>Bid Confirmed </h3>
                <p>Your bid of <strong>${amount}</strong> for <strong>${date}</strong> has been placed.</p>
                <p>You can update or cancel it before the deadline.</p>
            `
        });

        return true;
    };
}

module.exports = { NotificationService };