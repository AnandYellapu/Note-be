// const Task = require('../models/Task');
// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const config = require('../config/config');
// const nodemailer = require('nodemailer');
// const fs = require('fs');
// const path = require('path');
// const { promisify } = require('util');
// const readFileAsync = promisify(fs.readFile);

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // e.g., 'gmail'
//   auth: {
//     user: 'anandsaiii1200@gmail.com',
//     pass: 'azjtjuhdytbpdcfn',
//   },
// });


// const sendReminderEmail = async (userEmail, taskTitle) => {
//   const mailOptions = {
//     from: 'anandsaiii1200@gmail.com',
//     to: userEmail,
//     subject: 'Reminder: Task Deadline',
//     html: `
//       <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #f9f9f9; color: #333; padding: 30px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
//         <div style="text-align: center; margin-bottom: 20px;">
//           <img src="cid:notepadLogo" alt="Note Maker Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;" />
//           <h1 style="font-size: 32px; margin: 0; color: #3498db;">Note Maker</h1>
//         </div>
//         <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
//           Dear User,
//           <br /><br />
//           This is a friendly reminder that the deadline for your task "<strong>${taskTitle}</strong>" is approaching.
//           Please make sure to complete it on time.
//           <br /><br />
//           <span style="font-weight: bold; color: #e74c3c;">Note:</span> Ignoring this reminder may result in delays.
//           <br /><br />
//           Best regards,
//           <br />
//           The Note Maker Team
//         </p>
//         <div style="text-align: center;">
//           <a href="https://note-maker-app.com" target="_blank" style="text-decoration: none; color: #fff; font-weight: bold; font-size: 18px; display: inline-block; padding: 15px 30px; background-color: #3498db; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); transition: background-color 0.3s;">
//             Visit Note Maker
//           </a>
//         </div>
//       </div>
//     `,
//     attachments: [
//       {
//         filename: 'notepad.jpg',
//         path: 'public/images/notepad.jpg',
//         cid: 'notepadLogo',
//       },
//     ],
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Reminder email sent successfully');
//   } catch (error) {
//     console.error('Error sending reminder email:', error.message);
//   }
// };



// const getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ user: req.user._id });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



// const createTask = async (req, res) => {
//   const { title, description, deadline } = req.body;

//   try {
//     const newTask = new Task({
//       title,
//       description,
//       deadline,
//       user: req.user._id,
//     });

//     const savedTask = await newTask.save();

//     // Check if the task has a deadline and send a reminder email if necessary
//     if (deadline) {
//       const user = await User.findById(req.user._id);
//       if (user) {
//         sendReminderEmail(user.email, title);
//       }
//     }

//     res.json(savedTask);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



// const updateTask = async (req, res) => {
//   const { completed } = req.body;

//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     task.completed = completed;
//     task.completedDate = completed ? new Date() : null; // Set completedDate if task is completed

//     const updatedTask = await task.save();
//     res.json(updatedTask);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteTask = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Task.findByIdAndDelete(id);
//     res.json({ message: 'Task deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   getTasks,
//   createTask,
//   updateTask,
//   deleteTask,
// };








const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail'
  auth: {
    user: 'anandsaiii1200@gmail.com',
    pass: 'azjtjuhdytbpdcfn',
  },
});

const sendReminderEmail = async (userEmail, taskTitle) => {
  const mailOptions = {
    from: 'anandsaiii1200@gmail.com',
    to: userEmail,
    subject: 'Reminder: Task Deadline',
    html: `
      <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #f9f9f9; color: #333; padding: 30px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:notepadLogo" alt="Note Maker Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;" />
          <h1 style="font-size: 32px; margin: 0; color: #3498db;">Note Maker</h1>
        </div>
        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
          Dear User,
          <br /><br />
          This is a friendly reminder that the deadline for your task "<strong>${taskTitle}</strong>" is approaching.
          Please make sure to complete it on time.
          <br /><br />
          <span style="font-weight: bold; color: #e74c3c;">Note:</span> Ignoring this reminder may result in delays.
          <br /><br />
          Best regards,
          <br />
          The Note Maker Team
        </p>
        <div style="text-align: center;">
          <a href="https://note-maker-app.com" target="_blank" style="text-decoration: none; color: #fff; font-weight: bold; font-size: 18px; display: inline-block; padding: 15px 30px; background-color: #3498db; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); transition: background-color 0.3s;">
            Visit Note Maker
          </a>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'notepad.jpg',
        path: 'public/images/notepad.jpg',
        cid: 'notepadLogo',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reminder email sent successfully');
  } catch (error) {
    console.error('Error sending reminder email:', error.message);
  }
};

// Function to send daily reminders until the task is completed
const sendDailyReminders = async (userEmail, taskTitle, taskDeadline) => {
  const today = new Date();
  const deadline = new Date(taskDeadline);

  // Check if the task is not completed and the deadline is in the future
  if (!task.completed && deadline > today) {
    // Calculate the time difference in milliseconds
    const timeDifference = deadline - today;

    // Calculate the number of days until the deadline
    const daysUntilDeadline = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // If there are less than 3 days until the deadline, send a daily reminder
    if (daysUntilDeadline <= 3) {
      await sendReminderEmail(userEmail, taskTitle);
    }
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, deadline } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      deadline,
      user: req.user._id,
    });

    const savedTask = await newTask.save();

    // Check if the task has a deadline and schedule daily reminders if necessary
    if (deadline) {
      const user = await User.findById(req.user._id);
      if (user) {
        await sendReminderEmail(user.email, title);
        // Schedule daily reminders until the task is completed
        setInterval(() => sendDailyReminders(user.email, title, deadline), 24 * 60 * 60 * 1000); // Repeat every 24 hours
      }
    }

    res.json(savedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  const { completed } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = completed;
    task.completedDate = completed ? new Date() : null; // Set completedDate if task is completed

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
