import { configDotenv } from "dotenv";
configDotenv();
import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (email, subject, message) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  try {
  await transporter.sendMail({
    from : email,
    // from: "sahilnodemailer15@gmail.com",
    to: "sahilnodemailer15@gmail.com",
    subject: subject,
    html: message,
  });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
