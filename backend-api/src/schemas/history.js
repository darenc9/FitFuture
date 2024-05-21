//install mongoose once decided on DB
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  historyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  userId: mongoose.Schema.Types.ObjectId, 
  workoutExerciseId: mongoose.Schema.Types.ObjectId, 
  Date: Date, 
  reps: Number, 
  duration: Number, 
  weight: Number, 
});

const History = mongoose.model('history', historySchema);

module.exports = History;

