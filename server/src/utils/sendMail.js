const nodemailer = require("nodemailer");
const { env } = require("../config/env");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.emailUser,
        pass: env.emailPass
    }
});

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: env.emailUser,
        to,
        subject,
        html
    });
};

module.exports = { sendEmail };