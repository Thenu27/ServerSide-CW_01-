const nodemailer = require("nodemailer");
const { env } = require("../config/env");

// Configure email transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.emailUser, // Sender email
        pass: env.emailPass  // App password
    }
});

// Send email function
const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: env.emailUser, // Sender
        to,                  // Recipient
        subject,             // Email subject
        html                 // Email content (HTML)
    });
};

module.exports = { sendEmail };