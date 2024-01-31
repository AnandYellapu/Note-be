// // controllers/taskController.js
// const Task = require('../models/Task');

// const getTasks = async (req, res) => {
//   try {
//     // Fetch tasks associated with the authenticated user
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
//       user: req.user._id, // Set the user ID when creating a task
//     });

//     const savedTask = await newTask.save();
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
const sendEmailReminder = require('../sendEmailReminder') // Import the sendEmailReminder function

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

    // Send email reminder
    await sendEmailReminder(savedTask);

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
    task.completedDate = completed ? new Date() : null;

    const updatedTask = await task.save();

    // Send email reminder if the task is completed
    if (completed) {
      await sendEmailReminder(updatedTask);
    }

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
