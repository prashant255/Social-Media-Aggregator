'use strict';

const nodemailer = require("nodemailer")
const jwt = require('jsonwebtoken')

const sendMail = async (receiverId, receiverName, receiverEmail) => {
  console.log(receiverId)
  let transporter = nodemailer.createTransport({
    service: "Gmail", // service used to send mail   
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS,
    },
  });

  await jwt.sign(
    {
      userId: receiverId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
    (err, emailToken) => {
      const url = `http://localhost:8080/api/auth/confirmation/${emailToken}`;
      console.log(url)

      transporter.sendMail({
        from: '"Lurker App" <lurker.confirmation@gmail.com>', // sender address
        to: receiverEmail, // list of receivers
        subject: "Confirmation Email", // Subject line
        html: `<b>Hi ${receiverName}, Welcome to Lurker!</b><p> Please click on the following link to confirm your email: <a href="${url}">${url}</a>` // html body
      });
    },
  );
}

module.exports = {
  sendMail
}