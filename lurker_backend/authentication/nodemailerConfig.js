"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  let transporter = nodemailer.createTransport({
    service: "Gmail", // service used to send mail   
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS,
    },
  });

  const url = "http://localhost:8080/confirmation"

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Lurker App" <lurker.confirmation@gmail.com>', // sender address
    // TODO: Change this to the receiver user from the frontend.
    to: "prashantsa255@gmail.com", // list of receivers
    subject: "Confirm Email", // Subject line
    //TODO: Change 'Prashant' to receiver Name
    html: `<b>Hi Prashant, Welcome to Lurker!</b><p> Please click on the following link to confirm your email: <a href="${url}">${url}</a>` // html body
  });

  console.log("Message sent: %s", info.messageId); // Confirmation for the mail send.
}

main().catch(console.error);