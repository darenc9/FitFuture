// schema for mongoDB - Profile  Schema
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  userId: { // which account this profile belongs to
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  age: Number,
  height: Number,   // in centimeters?
  weight: Number,
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
