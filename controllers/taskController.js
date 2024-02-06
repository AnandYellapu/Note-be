const Task = require('../models/Task');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');


const transporter = nodemailer.createTransport({
  service: 'gmail',
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



const getTasks = async (req, res) => {
  try {
    // Ensure the user is authenticated before fetching tasks
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. User not authenticated.' });
    }

    // Fetch tasks for the authenticated user
    const tasks = await Task.find({ user: req.user._id });

    // Convert date and time to IST before sending the response
    const tasksInIST = tasks.map(task => ({
      ...task._doc,
      deadline: task.deadline ? moment(task.deadline).tz('Asia/Kolkata').format() : null,
      reminder: task.reminder ? moment(task.reminder).tz('Asia/Kolkata').format() : null,
      completedDate: task.completedDate ? moment(task.completedDate).tz('Asia/Kolkata').format() : null,
    }));

    // Respond with the retrieved tasks in IST
    res.json(tasksInIST);
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error('Error fetching tasks:', error);

    // Respond with an internal server error status and the error message
    res.status(500).json({ error: 'Internal Server Error. Could not fetch tasks.' });
  }
};




const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, tags, reminder } = req.body;
    const userId = req.user._id; // Assuming user information is stored in req.user

    // Basic server-side validation
    if (!title || !description || !deadline) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create a new task with the user information
    const newTask = new Task({
      title,
      description,
      deadline,
      priority,
      tags,
      reminder,
      user: userId, // Add the user information to the task
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Check if a reminder is set
    if (reminder) {
      // Format the reminder date and time using moment
      const reminderDateTime = moment(reminder).format('YYYY-MM-DD HH:mm:ss');

      // Schedule a job or use a background task runner (like cron) to send the reminder email
      // Here, we're using a simple setTimeout to simulate a background job
      const reminderJob = setTimeout(async () => {
        try {
          // Get the user's email from the database using userId
          const user = await User.findById(userId);
          const userEmail = user.email;

          // Send the reminder email
          await sendReminderEmail(userEmail, title);
        } catch (error) {
          console.error('Error sending reminder email:', error.message);
        }
      }, moment(reminderDateTime).diff(moment())); // Calculate the time difference for setTimeout

      console.log('Reminder scheduled:', reminderJob);
    }

    res.status(201).json({ message: 'Task created successfully', task: savedTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};






// const updateTask = async (req, res) => {
//   const taskId = req.params.id;
//   const updatedTaskData = req.body;

//   try {
//     const task = await Task.findById(taskId);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     const currentReminderTime = task.reminder ? task.reminder.getTime() : null;
//     const updatedReminderTime = updatedTaskData.reminder ? new Date(updatedTaskData.reminder).getTime() : null;

//     console.log('Current Time:', new Date());
//     console.log('Updated Reminder Time:', updatedReminderTime);

//     task.title = updatedTaskData.title || task.title;
//     task.description = updatedTaskData.description || task.description;
//     task.deadline = updatedTaskData.deadline ? new Date(updatedTaskData.deadline) : task.deadline;
//     task.priority = updatedTaskData.priority || task.priority;
//     task.tags = updatedTaskData.tags || task.tags;
//     task.reminder = updatedTaskData.reminder ? new Date(updatedTaskData.reminder) : null;

//     await task.save();

//     if (updatedReminderTime && currentReminderTime !== updatedReminderTime) {
//       const user = await User.findById(req.user._id);

//       if (user) {
//         const timeDifference = updatedReminderTime - new Date().getTime();

//         setTimeout(async () => {
//           await sendReminderEmail(user.email, task.title);
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



const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const updatedTaskData = req.body;

  try {
    // Fetch the existing task from the database
    const task = await Task.findById(taskId);

    // Log for debugging
    console.log('TaskId:', taskId);
    console.log('Existing Task:', task);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task properties
    task.title = updatedTaskData.title || task.title;
    task.description = updatedTaskData.description;
    task.deadline = updatedTaskData.deadline;
    task.priority = updatedTaskData.priority;
    task.tags = updatedTaskData.tags;
    task.reminder = updatedTaskData.reminder;

    // Save the updated task
    const updatedTask = await task.save();

    // Check if a reminder is set in the updated task
    if (updatedTask.reminder) {
      // Format the updated reminder date and time using moment
      const updatedReminderDateTime = moment(updatedTask.reminder).format('YYYY-MM-DD HH:mm:ss');

      // Cancel any existing reminder job (if any)
      clearTimeout(task.reminderJob);

      // Schedule a new reminder job
      const reminderJob = setTimeout(async () => {
        try {
          // Get the user's email from the database using userId
          const user = await User.findById(updatedTask.user);
          const userEmail = user.email;

          // Send the reminder email
          await sendReminderEmail(userEmail, updatedTask.title);
        } catch (error) {
          console.error('Error sending reminder email:', error.message);
        }
      }, moment(updatedReminderDateTime).diff(moment())); // Calculate the time difference for setTimeout

      // Update the task's reminder job reference
      task.reminderJob = reminderJob;

      console.log('Reminder rescheduled:', reminderJob);
    }

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
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

