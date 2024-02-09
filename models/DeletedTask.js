const mongoose = require('mongoose');
const moment = require('moment-timezone');

const deletedTaskSchema = new mongoose.Schema({
  originalTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
});

const DeletedTask = mongoose.model('DeletedTask', deletedTaskSchema);

module.exports = DeletedTask;
