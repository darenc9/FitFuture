const mongoose = require('mongoose');
const Workout = require('../schemas/Workout');
const { connectToDb } = require('./connectToDB');

let WorkoutModel;

// Ensure the database connection is established and the model is set up
const ensureConnection = async () => {
    if (!WorkoutModel) {
        //use imported connect to db function to connect to mongo
      await connectToDb();
      WorkoutModel = mongoose.model('Workout', Workout.schema);
    }
  };


  module.exports.getWorkoutById = async function (id) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
      WorkoutModel.findOne({ workoutId: id }).exec()
        .then((workout) => {
          if (workout) {
            resolve(workout);
          } else {
            reject('Workout record not found');
          }
        })
        .catch((err) => reject('Error retrieving workout record: ' + err.message));
    });
  };

//get all workouts that are not associated with a user (ie all preset workouts)
//userId should be null
module.exports.getAllWorkouts = async function (user) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
      const query = {
        $or: [
          { public: true },
          { userId: user }
        ]
      };
      WorkoutModel.find(query).exec()
        .then((workouts) => {
          if (workouts.length > 0) {
            resolve(workouts);
          } else {
            reject('No workout records found where userId is null');
          }
        })
        .catch((err) => reject('Error retrieving workout records: ' + err.message));
    });
  };

  // Create a new workout
module.exports.createWorkout = async function (workoutData) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
      const workout = new WorkoutModel(workoutData);
      workout.save()
          .then((savedWorkout) => resolve(savedWorkout))
          .catch((err) => reject('Error creating workout record: ' + err.message));
  });
};


//for admin to update or user when creating custom workout
module.exports.updateWorkout = async function (id, updateData) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
      WorkoutModel.findOneAndUpdate({ workoutId: id }, updateData, { new: true }).exec()
        .then((workout) => {
          if (workout) {
            resolve(workout);
          } else {
            reject('Workout record not found');
          }
        })
        .catch((err) => reject('Error updating workout record: ' + err.message));
    });
  };

//may not be needed but added in case admin account needs to delete
module.exports.deleteWorkout = async function (id) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
      WorkoutModel.findOneAndDelete({ workoutId: id }).exec()
        .then((workout) => {
          if (workout) {
            resolve(workout);
          } else {
            reject('Workout record not found');
          }
        })
        .catch((err) => reject('Error deleting workout record: ' + err.message));
    });
  };