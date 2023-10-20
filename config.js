const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
  jwtSecret: process.env.JWT_SECRET,
  jwtLifetime: process.env.JWT_LIFETIME,
  gmailUser: process.env.GMAIL_USER,
  gmailPass: process.env.GMAIL_PASSWORD,
};
