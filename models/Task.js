// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//   },
//   deadline: {
//     type: Date,
//   },
//   priority: {
//     type: String, // Change the type according to your priority values (e.g., 'high', 'medium', 'low')
//   },
//   tags: {
//     type: String,
//   },
//   reminder: {
//     type: Date,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
//   completedDate: {
//     type: Date,
//   },
//   // Add a reference to the user who owns this task
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
// }, { timestamps: true });

// const Task = mongoose.model('Task', taskSchema);

// module.exports = Task;






const mongoose = require('mongoose');
const moment = require('moment-timezone');

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

// Middleware to convert dates to IST before saving
taskSchema.pre('save', function (next) {
  // Convert deadline, reminder, and completedDate to IST
  if (this.deadline) {
    this.deadline = moment(this.deadline).tz('Asia/Kolkata').toDate();
  }
  if (this.reminder) {
    this.reminder = moment(this.reminder).tz('Asia/Kolkata').toDate();
  }
  if (this.completedDate) {
    this.completedDate = moment(this.completedDate).tz('Asia/Kolkata').toDate();
  }

  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
