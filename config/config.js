// // config.js
// require('dotenv').config();

// module.exports = {
//   port: process.env.PORT || 4444,
//   dbURI: process.env.DB_URI,
//   jwtSecret: process.env.JWT_SECRET,
// };





require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4444,
  dbURI: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
};
