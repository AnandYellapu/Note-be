const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  deadline: {
    type: Date,
  },
  priority: {
    type: String, // Change the type according to your priority values (e.g., 'high', 'medium', 'low')
  },
  tags: {
    type: String,
  },
  reminder: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedDate: {
    type: Date,
  },
  // Add a reference to the user who owns this task
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

