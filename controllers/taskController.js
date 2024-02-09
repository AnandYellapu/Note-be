const Task = require('../models/Task');
const User = require('../models/User');
const DeletedTask = require('../models/DeletedTask');
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
  console.log('Recipient email:', userEmail); 
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
  try {
    // Destructure task details from the request body
    const { title, description, deadline, priority, tags, reminder } = req.body;

    // Ensure that the user ID is retrieved from the authenticated user
    const userId = req.user._id;

    // Create a new task object using the Task model
    const newTask = new Task({
      title,
      description,
      deadline,
      priority,
      tags,
      reminder,
      user: userId, // Assign the retrieved user ID
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // If reminder is set, schedule the reminder email
    if (reminder) {
      const user = await User.findById(userId);
      // Convert deadline and reminder to IST
      const deadlineIST = moment(deadline).tz('Asia/Kolkata');
      const reminderDate = moment(reminder).tz('Asia/Kolkata');
      const currentTime = moment().tz('Asia/Kolkata');

      // Calculate the delay until the reminder date
      const delay = reminderDate - currentTime;

      // Ensure that the reminder date is in the future
      if (delay > 0) {
        setTimeout(async () => {
          try {
            // Send reminder email
            await sendReminderEmail(user.email, title);
          } catch (error) {
            console.error('Error sending reminder email:', error.message);
          }
        }, delay);
      } else {
        console.warn('Reminder date is in the past. Reminder email not scheduled.');
      }
    }

    // Respond with the saved task
    res.status(201).json(savedTask);
  } catch (error) {
    // Handle any errors that occur during task creation
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Could not create task. Please try again later.' });
  }
};



// needed
const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const updatedTaskData = req.body;

  console.log('Received request to update task with ID:', taskId);
  console.log('Request body:', updatedTaskData);

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task completion status is being updated
    if (updatedTaskData.completed !== undefined) {
      // If the task was marked as completed and is now being edited to false, reset completion status
      if (task.completed && !updatedTaskData.completed) {
        task.completed = false;
        task.completedDate = null;
      } else if (!task.completed && updatedTaskData.completed) {
        // If the task was not completed and is now marked as completed, update completion date
        task.completed = true;
        task.completedDate = new Date().toISOString();
      }
    }

    // Update task data
    task.title = updatedTaskData.title || task.title;
    task.description = updatedTaskData.description || task.description;
    task.deadline = updatedTaskData.deadline || task.deadline;
    task.priority = updatedTaskData.priority || task.priority;
    task.tags = updatedTaskData.tags || task.tags;
    task.reminder = updatedTaskData.reminder || task.reminder;

    // Save the updated task
    await task.save();

    // If reminder is updated, reschedule the reminder email
    if (updatedTaskData.reminder) {
      const user = await User.findById(req.user._id);
      const reminderDate = new Date(updatedTaskData.reminder); // Convert reminder string to Date object
      const currentTime = new Date();

      // Calculate the delay until the reminder date
      const delay = reminderDate - currentTime;

      // Ensure that the reminder date is in the future
      if (delay > 0) {
        setTimeout(async () => {
          try {
            // Send reminder email
            await sendReminderEmail(user.email, task.title);
          } catch (error) {
            console.error('Error sending reminder email:', error.message);
          }
        }, delay);
      } else {
        console.warn('Reminder date is in the past. Reminder email not scheduled.');
      }
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};






// const deleteTask = async (req, res) => {
//   const { id } = req.params;
//   try {
//     // Find the task to be "deleted" and mark it as deleted
//     const deletedTask = await Task.findByIdAndUpdate(id, { deleted: true }, { new: true });

//     if (!deletedTask) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     res.json({ message: 'Task marked as deleted', deletedTask });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the task to be deleted
    const deletedTask = await Task.findByIdAndDelete(id, { deleted: true }, { new: true });

    // Cancel reminder if the task has a reminder set
    if (deletedTask.reminder) {
      // Clear timeout to prevent sending the reminder email
      clearTimeout(deletedTask.reminderTimeout);
    }

    res.json({ message: 'Task deleted successfully', deletedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const undoTaskDeletion = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the task to be "undone" and mark it as not deleted
    const restoredTask = await Task.findByIdAndUpdate(id, { deleted: false }, { new: true });

    if (!restoredTask) {
      return res.status(404).json({ error: 'Deleted task not found' });
    }

    res.json({ message: 'Task deletion undone', restoredTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  undoTaskDeletion,
};
