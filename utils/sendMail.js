const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, text, html, attachments, from }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_NAME}>`,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
};
module.exports = sendMail;
