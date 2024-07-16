//install mongoose once decided on DB
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  historyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  exerciseName: String,
  exerciseId: String,
  date: Date, 
  info: Array, //array is of objects of {reps, weight, duration}
  notes: String
});

const History = mongoose.model('History', historySchema);

module.exports = History;

