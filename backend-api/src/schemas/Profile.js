// schema for mongoDB - Profile  Schema
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  dob: Date,
  height: Number,   // in centimeters
  // weight: Number,   // in kgs
  weight: [],   // in kgs
  sex: String,
  fitnessLevel: String,
  favourites: {
    exercises: [],
    workouts: [],
    routines: []
  }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
