// /schemas/WorkoutExercise.js

// this schema will be used to denote exercise descriptions such as sets and reps
// for preset workouts in addition to being used to track progress of workouts users
// are performing

const mongoose = require('mongoose');

const workoutExerciseSchema = new mongoose.Schema({
    workoutExerciseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  workoutId: mongoose.Schema.Types.ObjectId, 
  exerciseId: String,
  sets: Number,
  reps: Number,
  duration: Number, //maybe in seconds?
  weight: Number,
  notes: String



});

const WorkoutExercise = mongoose.model('WorkoutExercise', workoutExerciseSchema);

module.exports = WorkoutExercise;