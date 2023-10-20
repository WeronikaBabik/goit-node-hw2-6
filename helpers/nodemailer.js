const nodemailer = require("nodemailer");
const { gmailUser, gmailPass } = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

const sendMail = async (options) => {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.error(error);
    throw new Error("Mail sending failed!");
  }
};

module.exports = {
  sendMail,
};
