//schema for mongoDB - Workout Schema
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  workoutId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  userId: mongoose.Schema.Types.ObjectId, //null for preset, set for a users custom workouts
  routineId: mongoose.Schema.Types.ObjectId,
  name: String,
  category: String
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;