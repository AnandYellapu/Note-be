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
    set: function (deadline) {
      if (deadline) {
        return moment(deadline).tz('Asia/Kolkata').toDate(); // Convert to IST
      }
      return deadline;
    }
  },
  priority: {
    type: String, // Change the type according to your priority values (e.g., 'high', 'medium', 'low')
  },
  tags: {
    type: String,
  },
  reminder: {
    type: Date,
    set: function (reminder) {
      if (reminder) {
        return moment(reminder).tz('Asia/Kolkata').toDate(); // Convert to IST
      }
      return reminder;
    }
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedDate: {
    type: Date,
    set: function (completedDate) {
      if (completedDate) {
        return moment(completedDate).tz('Asia/Kolkata').toDate(); // Convert to IST
      }
      return completedDate;
    }
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
