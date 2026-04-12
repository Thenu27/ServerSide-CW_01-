const {sendEmail} = require('../utils/sendMail')

class NotificationService {

        sendEmailVerification = async ({ to, link }) => {
        await sendEmail({
            to,
            subject: "Verify your email",
            html: `
                <h2>Verify Your Email</h2>
                <p>Click the button below to verify your account:</p>
                <a href="${link}" style="
                    display:inline-block;
                    padding:10px 20px;
                    background-color:#4CAF50;
                    color:white;
                    text-decoration:none;
                    border-radius:5px;
                ">
                    Verify Email
                </a>
                <p>If you did not register, ignore this email.</p>
            `
            });
        };

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