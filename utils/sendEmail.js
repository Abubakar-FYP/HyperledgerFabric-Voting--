const nodemailer = require('nodemailer');


const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    const message = {
        from: process.env.GMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    await transporter.sendMail(message)
}

module.exports = sendEmail;