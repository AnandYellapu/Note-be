// const Task = require('../models/Task');
// const User = require('../models/User');



// // const AWS = require('aws-sdk');

// // // Set your AWS credentials and region
// // AWS.config.update({
// //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// //   region: process.env.AWS_REGION,
// // });

// // const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// // const sendReminderEmail = async (userEmail, taskTitle) => {
// //   const params = {
// //     Destination: {
// //       ToAddresses: [userEmail],
// //     },
// //     Message: {
// //       Body: {
// //         Html: {
// //           Charset: 'UTF-8',
// //           Data: `
// //             <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #f9f9f9; color: #333; padding: 30px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
// //             <div style="text-align: center; margin-bottom: 20px;">
// //             <img src="cid:notepadLogo" alt="Note Maker Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;" />
// //             <h1 style="font-size: 32px; margin: 0; color: #3498db;">Note Maker</h1>
// //           </div>
// //           <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
// //             Dear User,
// //             <br /><br />
// //             This is a friendly reminder that the deadline for your task "<strong style={{ color: 'red', fontWeight: 'bold' }}>${taskTitle}</strong>" is approaching.
// //             Please make sure to complete it on time.
// //             <br /><br />
// //             <span style="font-weight: bold; color: #e74c3c;">Note:</span> Ignoring this reminder may result in delays.
// //             <br /><br />
// //             Best regards,
// //             <br />
// //             The Note Maker Team
// //           </p>
// //           <div style="text-align: center;">
// //             <a href="https://notes-maker12.netlify.app/" target="_blank" style="text-decoration: none; color: #fff; font-weight: bold; font-size: 18px; display: inline-block; padding: 15px 30px; background-color: #3498db; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); transition: background-color 0.3s;">
// //               Visit Note Maker
// //             </a>
// //           </div>
// //             </div>
// //           `,
// //         },
// //       },
// //       Subject: {
// //         Charset: 'UTF-8',
// //         Data: 'Reminder: Task Deadline',
// //       },
// //     },
// //     Source: userEmail,
// //     ReplyToAddresses: [userEmail],
// //   };

// //   try {
// //     await ses.sendEmail(params).promise();
// //     console.log('Reminder email sent successfully');
// //   } catch (error) {
// //     console.error('Error sending reminder email:', error.message);
// //   }
// // };




// const nodemailer = require('nodemailer');



// const transporter = nodemailer.createTransport({
//   // host: process.env.SMTP_HOST,
//   // port: process.env.SMTP_PORT,
//   // secure: true, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USERNAME,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// const sendReminderEmail = async (userEmail, taskTitle) => {
//   console.log(process.env.SMTP_USERNAME, userEmail);
//   const mailOptions = {
//     from: process.env.SMTP_USERNAME,
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
//           This is a friendly reminder that the deadline for your task "<strong style={{ color: 'red', fontWeight: 'bold' }}>${taskTitle}</strong>" is approaching.
//           Please make sure to complete it on time.
//           <br /><br />
//           <span style="font-weight: bold; color: #e74c3c;">Note:</span> Ignoring this reminder may result in delays.
//           <br /><br />
//           Best regards,
//           <br />
//           The Note Maker Team
//         </p>
//         <div style="text-align: center;">
//           <a href="https://notes-maker12.netlify.app/" target="_blank" style="text-decoration: none; color: #fff; font-weight: bold; font-size: 18px; display: inline-block; padding: 15px 30px; background-color: #3498db; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); transition: background-color 0.3s;">
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
//     // Ensure the user is authenticated before fetching tasks
//     if (!req.user) {
//       return res.status(401).json({ error: 'Unauthorized. User not authenticated.' });
//     }

//     // Fetch tasks for the authenticated user
//     const tasks = await Task.find({ user: req.user._id });

//     // Respond with the retrieved tasks
//     res.json(tasks);
//   } catch (error) {
//     // Handle any errors that occur during the fetch
//     console.error('Error fetching tasks:', error);

//     // Respond with an internal server error status and the error message
//     res.status(500).json({ error: 'Internal Server Error. Could not fetch tasks.' });
//   }
// };



// const createTask = async (req, res) => {
//   const { title, description, deadline, priority, tags, reminder } = req.body;

//   try {
//     const newTask = new Task({
//       title,
//       description,
//       deadline,
//       priority,
//       tags,
//       reminder,
//       user: req.user._id,
//     });

//     const savedTask = await newTask.save();

//     // Check if the task has a reminder and schedule it if necessary
//     if (reminder) {
//       const user = await User.findById(req.user._id);
//       if (user) {
//         // Parse the selected reminder time from the input values
//         const selectedReminderTime = new Date(reminder).getTime();
//         const currentDateTime = new Date().getTime();

//         // Calculate the initial time difference until the selected reminder time
//         const initialTimeDifference = selectedReminderTime - currentDateTime;

//         // Schedule the initial reminder to be sent after the initial time difference
//         setTimeout(async () => {
//           await sendReminderEmail(user.email, title);
//           // Now, schedule daily reminders at 11:50 AM and 4:00 PM until the deadline
//           scheduleDailyReminders(user, title, deadline);
//         }, initialTimeDifference);
//       }
//     }

//     res.json(savedTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // Helper function to schedule daily reminders between two specific times
// const scheduleDailyReminders = async (user, taskTitle, deadline) => {
//   const currentDate = new Date();
//   const reminderTime1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 12, 45, 0, 0);
//   const reminderTime2 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 16, 0, 0, 0);

//   // Calculate time differences for both reminder times
//   const timeDifference1 = reminderTime1.getTime() - currentDate.getTime();
//   const timeDifference2 = reminderTime2.getTime() - currentDate.getTime();

//   // Schedule daily reminders at 9:00 AM and 4:00 PM until the deadline
//   if (timeDifference1 > 0) {
//     setTimeout(async () => {
//       await sendReminderEmail(user.email, taskTitle);
//       scheduleDailyReminders(user, taskTitle, deadline);
//     }, timeDifference1);
//   }

//   if (timeDifference2 > 0) {
//     setTimeout(async () => {
//       await sendReminderEmail(user.email, taskTitle);
//       scheduleDailyReminders(user, taskTitle, deadline);
//     }, timeDifference2);
//   }
// };








// const updateTask = async (req, res) => {
//   const taskId = req.params.id;
//   const updatedTaskData = req.body;

//   try {
//     // Find the task by ID
//     const task = await Task.findById(taskId);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     // Get the current reminder time and updated reminder time
//     const currentReminderTime = task.reminder ? new Date(task.reminder).getTime() : null;
//     const updatedReminderTime = updatedTaskData.reminder ? new Date(updatedTaskData.reminder).getTime() : null;

//     // Update task data
//     task.title = updatedTaskData.title || task.title;
//     task.description = updatedTaskData.description || task.description;
//     task.deadline = updatedTaskData.deadline || task.deadline;
//     task.priority = updatedTaskData.priority || task.priority;
//     task.tags = updatedTaskData.tags || task.tags;
//     task.reminder = updatedTaskData.reminder || task.reminder;

//     // Save the updated task
//     await task.save();

//     // Check if the task has an updated reminder and schedule it if necessary
//     if (updatedReminderTime && currentReminderTime !== updatedReminderTime) {
//       const user = await User.findById(req.user._id);
//       if (user) {
//         // Calculate the time difference until the updated reminder time
//         const timeDifference = updatedReminderTime - new Date().getTime();

//         // Schedule the reminder to be sent at the updated reminder time
//         setTimeout(async () => {
//           await sendReminderEmail(user.email, task.title);
//           // Now, schedule daily reminders at 11:50 AM and 4:00 PM until the deadline
//           scheduleDailyReminders(user, task.title, task.deadline);
//         }, timeDifference);
//       }
//     }

//     res.status(200).json({ message: 'Task updated successfully', task });
//   } catch (error) {
//     console.error('Error updating task:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
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



// const AWS = require('aws-sdk');

// // Set your AWS credentials and region
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// const sendReminderEmail = async (userEmail, taskTitle) => {
//   const params = {
//     Destination: {
//       ToAddresses: [userEmail],
//     },
//     Message: {
//       Body: {
//         Html: {
//           Charset: 'UTF-8',
//           Data: `
//             <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #f9f9f9; color: #333; padding: 30px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
//             <div style="text-align: center; margin-bottom: 20px;">
//             <img src="cid:notepadLogo" alt="Note Maker Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px;" />
//             <h1 style="font-size: 32px; margin: 0; color: #3498db;">Note Maker</h1>
//           </div>
//           <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
//             Dear User,
//             <br /><br />
//             This is a friendly reminder that the deadline for your task "<strong style={{ color: 'red', fontWeight: 'bold' }}>${taskTitle}</strong>" is approaching.
//             Please make sure to complete it on time.
//             <br /><br />
//             <span style="font-weight: bold; color: #e74c3c;">Note:</span> Ignoring this reminder may result in delays.
//             <br /><br />
//             Best regards,
//             <br />
//             The Note Maker Team
//           </p>
//           <div style="text-align: center;">
//             <a href="https://notes-maker12.netlify.app/" target="_blank" style="text-decoration: none; color: #fff; font-weight: bold; font-size: 18px; display: inline-block; padding: 15px 30px; background-color: #3498db; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); transition: background-color 0.3s;">
//               Visit Note Maker
//             </a>
//           </div>
//             </div>
//           `,
//         },
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: 'Reminder: Task Deadline',
//       },
//     },
//     Source: userEmail,
//     ReplyToAddresses: [userEmail],
//   };

//   try {
//     await ses.sendEmail(params).promise();
//     console.log('Reminder email sent successfully');
//   } catch (error) {
//     console.error('Error sending reminder email:', error.message);
//   }
// };




const nodemailer = require('nodemailer');



// const transporter = nodemailer.createTransport({
  // host: process.env.SMTP_HOST,
  // port: process.env.SMTP_PORT,
  // secure: true,
  // auth: {
    // user: process.env.SMTP_USERNAME,
    // pass: process.env.SMTP_PASSWORD,
  // },
// });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendReminderEmail = async (userEmail, taskTitle) => {
  console.log(process.env.SMTP_USERNAME, userEmail);
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
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
          This is a friendly reminder that the deadline for your task "<strong style={{ color: 'red', fontWeight: 'bold' }}>${taskTitle}</strong>" is approaching.
          Please make sure to complete it on time.
          <br /><br />
          <span style="font-weight: bold; color: #e74c3c;">Note:</span> Ignoring this reminder may result in delays.
          <br /><br />
          Best regards,
          <br />
          The Note Maker Team
        </p>
        <div style="text-align: center;">
          <a href="https://notes-maker12.netlify.app/" target="_blank" style="text-decoration: none; color: #fff; font-weight: bold; font-size: 18px; display: inline-block; padding: 15px 30px; background-color: #3498db; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); transition: background-color 0.3s;">
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





const getTasks = async (req, res) => {
  try {
    // Ensure the user is authenticated before fetching tasks
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. User not authenticated.' });
    }

    // Fetch tasks for the authenticated user
    const tasks = await Task.find({ user: req.user._id });

    // Respond with the retrieved tasks
    res.json(tasks);
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error('Error fetching tasks:', error);

    // Respond with an internal server error status and the error message
    res.status(500).json({ error: 'Internal Server Error. Could not fetch tasks.' });
  }
};



const createTask = async (req, res) => {
  const { title, description, deadline, priority, tags, reminder } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      deadline,
      priority,
      tags,
      reminder,
      user: req.user._id,
    });

    const savedTask = await newTask.save();

    // Check if the task has a reminder and schedule it if necessary
    if (reminder) {
      const user = await User.findById(req.user._id);
      if (user) {
        // Parse the selected reminder time from the input values
        const selectedReminderTime = new Date(reminder).getTime();
        const currentDateTime = new Date().getTime();

        // Calculate the initial time difference until the selected reminder time
        const initialTimeDifference = selectedReminderTime - currentDateTime;

        // Schedule the initial reminder to be sent after the initial time difference
        setTimeout(async () => {
          await sendReminderEmail(user.email, title);
          // Now, schedule daily reminders at 11:50 AM and 4:00 PM until the deadline
          scheduleDailyReminders(user, title, deadline);
        }, initialTimeDifference);
      }
    }

    res.json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to schedule daily reminders between two specific times
const scheduleDailyReminders = async (user, taskTitle, deadline) => {
  const currentDate = new Date();
  const reminderTime1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 12, 45, 0, 0);
  const reminderTime2 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 16, 0, 0, 0);

  // Calculate time differences for both reminder times
  const timeDifference1 = reminderTime1.getTime() - currentDate.getTime();
  const timeDifference2 = reminderTime2.getTime() - currentDate.getTime();

  // Schedule daily reminders at 9:00 AM and 4:00 PM until the deadline
  if (timeDifference1 > 0) {
    setTimeout(async () => {
      await sendReminderEmail(user.email, taskTitle);
      scheduleDailyReminders(user, taskTitle, deadline);
    }, timeDifference1);
  }

  if (timeDifference2 > 0) {
    setTimeout(async () => {
      await sendReminderEmail(user.email, taskTitle);
      scheduleDailyReminders(user, taskTitle, deadline);
    }, timeDifference2);
  }
};








const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const updatedTaskData = req.body;

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Get the current reminder time and updated reminder time
    const currentReminderTime = task.reminder ? new Date(task.reminder).getTime() : null;
    const updatedReminderTime = updatedTaskData.reminder ? new Date(updatedTaskData.reminder).getTime() : null;

    // Update task data
    task.title = updatedTaskData.title || task.title;
    task.description = updatedTaskData.description || task.description;
    task.deadline = updatedTaskData.deadline || task.deadline;
    task.priority = updatedTaskData.priority || task.priority;
    task.tags = updatedTaskData.tags || task.tags;
    task.reminder = updatedTaskData.reminder || task.reminder;

    // Save the updated task
    await task.save();

    // Check if the task has an updated reminder and schedule it if necessary
    if (updatedReminderTime && currentReminderTime !== updatedReminderTime) {
      const user = await User.findById(req.user._id);
      if (user) {
        // Calculate the time difference until the updated reminder time
        const timeDifference = updatedReminderTime - new Date().getTime();

        // Schedule the reminder to be sent at the updated reminder time
        setTimeout(async () => {
          await sendReminderEmail(user.email, task.title);
          // Now, schedule daily reminders at 11:50 AM and 4:00 PM until the deadline
          scheduleDailyReminders(user, task.title, task.deadline);
        }, timeDifference);
      }
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
