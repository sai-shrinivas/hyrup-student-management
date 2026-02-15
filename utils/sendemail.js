import e from "express";
import nodemailer from "nodemailer";

const sendMail = async ({ from = "MERN Music Player <no-reply@mern-music>", to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};

export default sendMail;
