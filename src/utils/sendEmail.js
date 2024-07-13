import nodemailer from "nodemailer";
import { htmlTemplate } from "./htmlTemplate.js";

export const sendEmail = async (email, subject, token) => {
  // transpoerter resposible for sending the messages via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // email that will send the mails
      user: "farahashraf268f@gmail.com",
      pass: "ziegthghzdclrnmf",
    },
  });

  const info = await transporter.sendMail({
    from: '"Job search app" <farahashraf268f@gmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: htmlTemplate(token), // html body
  });
};
