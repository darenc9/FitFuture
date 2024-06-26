//schema for mongoDB - Workout Schema
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  workoutId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  userId: String, //null for preset, set for a users custom workouts
  routineId: mongoose.Schema.Types.ObjectId,
  public: Boolean,
  name: String,
  category: String
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;