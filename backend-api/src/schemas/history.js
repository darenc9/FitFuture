//install mongoose once decided on DB
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: String, 
  workoutExerciseId: mongoose.Schema.Types.ObjectId, 
  date: Date, 
  reps: Number,
  sets: Number,
  weight: Number,     // in lbs
  duration: Number,   // in sec
});

const History = mongoose.model('History', historySchema);

module.exports = History;

