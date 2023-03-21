require('dotenv').config();
const nodemailer = require('nodemailer');

const verifikasiEmail = (email) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
            user: 'ardiyul90@gmail.com',
            pass: 'ibpsibqekauwpubn', 
        },
    });
    return transporter.sendMail(email).then((info) => {
        console.log(`email terkirim ke: ${email}`)
    });
}

const emailResetPass = (resetpass) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
            user: 'ardiyul90@gmail.com',
            pass: 'ibpsibqekauwpubn', 
        },
    });
    return transporter.sendMail(resetpass);
}

module.exports = { verifikasiEmail, emailResetPass};