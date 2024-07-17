// Schema for Routines
const mongoose = require('mongoose');
const Workout = require('./Workout');

const routineSchema = new mongoose.Schema({
    routineId: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    routineName: String,
    userId: String, //null for preset, set for a users custom workouts
    public: Boolean,
    category: String,
    workoutIds: [{type: mongoose.Schema.Types.ObjectId, ref:'Workout'}],
    description: String,
});

const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;

