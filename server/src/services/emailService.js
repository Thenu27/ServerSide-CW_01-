const nodemailer = require('nodemailer');


class EmailService{
    constructor(){
        this.nodemailer = nodemailer.createTransport({
            service:"gmail",
            auth : {
                user : process.env.EMAIL_USER
            }
        })
    }

}

module.exports={EmailService}