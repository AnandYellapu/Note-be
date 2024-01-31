// const nodemailer = require('nodemailer');
// require('dotenv').config(); // Load environment variables from .env file

// const sendEmailReminder = async (task) => {
//   try {
//     // Configure nodemailer with environment variables
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USERNAME,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });

//     // Check the SMTP connection
//     transporter.verify(function (error, success) {
//       if (error) {
//         console.error('SMTP connection error:', error);
//         return;
//       }

//       console.log('SMTP connection is ready');

//       // Email content
//       const mailOptions = {
//         from: process.env.SMTP_USERNAME,
//         to: task.assigneeEmail,
//         subject: 'Task Reminder',
//         text: `Reminder: Your task "${task.title}" is due on ${task.deadline}.`,
//       };

//       // Send email
//       transporter.sendMail(mailOptions, function (mailError, info) {
//         if (mailError) {
//           console.error('Error sending email:', mailError);
//         } else {
//           console.log(`Email reminder sent for task: ${task.title}`);
//           console.log('Email sent:', info.response);
//         }
//       });
//     });
//   } catch (error) {
//     console.error(`Error sending email reminder: ${error.message}`);
//   }
// };

// module.exports = sendEmailReminder;








const nodemailer = require('nodemailer');
const config = require('./config/config');

const sendEmailReminder = async (task) => {
  try {
    // Configure nodemailer with environment variables
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: false, // Set to true if using SSL/TLS
      auth: {
        user: config.smtpUsername,
        pass: config.smtpPassword,
      },
    });

    // Check the SMTP connection
    transporter.verify(function (error, success) {
      if (error) {
        console.error('SMTP connection error:', error);
        return;
      }

      console.log('SMTP connection is ready');

      // Email content
      const mailOptions = {
        from: config.smtpUsername,
        to: task.assigneeEmail,
        subject: 'Task Reminder',
        text: `Reminder: Your task "${task.title}" is due on ${task.deadline}.`,
      };

      // Send email
      transporter.sendMail(mailOptions, function (mailError, info) {
        if (mailError) {
          console.error('Error sending email:', mailError);
        } else {
          console.log(`Email reminder sent for task: ${task.title}`);
          console.log('Email sent:', info.response);
        }
      });
    });
  } catch (error) {
    console.error(`Error sending email reminder: ${error.message}`);
  }
};

module.exports = sendEmailReminder;
