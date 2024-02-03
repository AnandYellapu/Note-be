const Task = require('../models/Task');
const User = require('../models/User');
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail'
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendReminderEmail = async (userEmail, taskTitle) => {
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

//     // Check if the task has a deadline and schedule reminders if necessary
//     if (deadline && reminder) {
//       const user = await User.findById(req.user._id);
//       if (user) {
//         await sendReminderEmail(user.email, title);
//         // Schedule reminders until the task is completed
//         const reminderInterval = setInterval(() => sendReminder(user.email, title, reminder), 24 * 60 * 60 * 1000); // Repeat every 24 hours

//         // Optionally, store the reminderInterval ID in the task document for future reference
//         savedTask.reminderIntervalId = reminderInterval._id;
//         await savedTask.save();
//       }
//     }

//     res.json(savedTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ error: error.message });
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

//     // Check if the task has a deadline and schedule a reminder if necessary
//     if (deadline && reminder) {
//       const user = await User.findById(req.user._id);
//       if (user) {
//         await sendReminderEmail(user.email, title);
//       }
//     }

//     res.json(savedTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ error: error.message });
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
//         const currentDate = new Date();
//         const reminderDate = new Date(reminder);

//         // Set the reminder time to 8 A.M.
//         reminderDate.setHours(8, 0, 0, 0);

//         // Calculate the time difference in milliseconds until 8 A.M.
//         const timeDifference = reminderDate - currentDate;

//         // Schedule the reminder to be sent after the calculated time difference
//         setTimeout(async () => {
//           await sendReminderEmail(user.email, title);
//         }, timeDifference);
//       }
//     }

//     res.json(savedTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ error: error.message });
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
//         // Parse the selected reminder time from the input value
//         const selectedReminderTime = new Date(reminder).getTime();

//         // Calculate the time difference in milliseconds until the selected reminder time
//         const timeDifference = selectedReminderTime - new Date().getTime();

//         // Schedule the reminder to be sent after the calculated time difference
//         setTimeout(async () => {
//           await sendReminderEmail(user.email, title);
//         }, timeDifference);
//       }
//     }

//     res.json(savedTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ error: error.message });
//   }
// };





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
        // Parse the selected reminder and deadline times from the input values
        const selectedReminderTime = new Date(reminder).getTime();
        const deadlineTime = new Date(deadline).getTime();

        // Calculate the initial time difference until the selected reminder time
        const initialTimeDifference = selectedReminderTime - new Date().getTime();

        // Schedule the first reminder to be sent after the initial time difference
        setTimeout(async () => {
          await sendReminderEmail(user.email, title);
        }, initialTimeDifference);

        // Calculate the daily intervals at 9 AM and 4 PM in milliseconds
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        const nineAMInMilliseconds = 9 * 60 * 60 * 1000;
        const fourPMInMilliseconds = 16 * 60 * 60 * 1000;

        // Schedule subsequent reminders to be sent every day at 9 AM and 4 PM between reminder and deadline
        const reminderInterval = setInterval(async () => {
          const currentDate = new Date().getTime();
          if (currentDate < deadlineTime) {
            const hours = new Date().getHours();

            // Send reminders at 9 AM and 4 PM
            if (hours === 9 || hours === 16) {
              await sendReminderEmail(user.email, title);
            }
          } else {
            // If the current date exceeds the deadline, clear the interval
            clearInterval(reminderInterval);
          }
        }, oneDayInMilliseconds);
      }
    }

    res.json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
};






const updateTask = async (req, res) => {
  const { completed } = req.body; // Remove attachments from the request body

  try {
    // Find the task by ID
    const task = await Task.findById(req.params.id);

    // Check if the task exists
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update task properties
    task.completed = completed;
    task.completedDate = completed ? new Date() : null; // Set completedDate if task is completed

    // Save the updated task
    const updatedTask = await task.save();

    // Respond with the updated task
    res.json(updatedTask);
  } catch (error) {
    // Handle any errors that occur during the update
    console.error('Error updating task:', error);

    // Respond with an internal server error status and the error message
    res.status(500).json({ error: 'Internal Server Error. Could not update task.' });
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
