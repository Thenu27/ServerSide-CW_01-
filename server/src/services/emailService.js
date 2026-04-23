const nodemailer = require('nodemailer');

// Service for handling email functionality
class EmailService {
    constructor() {
        // Configure nodemailer transport (Gmail)
        this.nodemailer = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER // Email from environment variable
            }
        })
    }
}

module.exports = { EmailService }