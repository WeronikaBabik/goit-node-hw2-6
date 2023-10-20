const { sendMail } = require("./nodemailer");

const sendUserVerificationMail = async (email, verificationToken) => {
  const mailOptions = {
    to: email,
    subject: "Hello from nodemailer!",
    text: `Please verify your account by visiting http://localhost:3000/users/verify/${verificationToken}`,
    html: `<h1>Hello!</h1><br/>Please verify your account by visiting <a href="http://localhost:3000/users/verify/${verificationToken}">here</a>!`,
  };
  await sendMail(mailOptions);
};

module.exports = { sendUserVerificationMail };
