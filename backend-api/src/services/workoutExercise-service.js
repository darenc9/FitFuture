const mongoose = require('mongoose');
const WorkoutExercise = require('../schemas/WorkoutExercise');
const { connectToDb } = require('./connectToDB');

let WorkoutExerciseModel;

// Ensure the database connection is established and the model is set up
const ensureConnection = async () => {
    if (!WorkoutExerciseModel) {
        //use imported connect to db function to connect to mongo
      await connectToDb();
      WorkoutExerciseModel = mongoose.model('WorkoutExercise', WorkoutExercise.schema);
    }
};

//get all workout exercises for a specific workout
module.exports.getWorkoutExerciseByWorkoutId = async function (id) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
        WorkoutExerciseModel.find({ workoutExerciseId: id }).exec()
        .then((workoutExercise) => {
          if (workoutExercise.length > 0) {
            resolve(workoutExercise);
          } else {
            reject(`No workoutExercise records found where id is ${id}`);
          }
        })
        .catch((err) => reject('Error retrieving workoutExercise records: ' + err.message));
    });
  };

//get a workout exercise by id (not sure if will be needed)
  module.exports.getWorkoutExerciseById = async function (id) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
      WorkoutExerciseModel.find({ workoutExerciseId: id }).exec()
        .then((workoutExercise) => {
          if (workoutExercise) {
            resolve(workoutExercise);
          } else {
            reject('workout exercise record not found');
          }
        })
        .catch((err) => reject('Error retrieving workout record: ' + err.message));
    });
  };

// Create a new workout exercise
module.exports.createWorkoutExercise = async function (data) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
      const newWorkoutExercise = new WorkoutExerciseModel(data);
      newWorkoutExercise.save()
        .then((workoutExercise) => resolve(workoutExercise))
        .catch((err) => reject('Error creating workout exercise: ' + err.message));
    });
  };

  // Update a workout exercise by id
module.exports.updateWorkoutExercise = async function (id, data) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
        //new: true ensures new (updated document is returned rather than original)
      WorkoutExerciseModel.findOneAndUpdate({workoutExerciseId: id}, data, { new: true }).exec()
        .then((workoutExercise) => {
          if (workoutExercise) {
            resolve(workoutExercise);
          } else {
            reject('workout exercise record not found');
          }
        })
        .catch((err) => reject('Error updating workout exercise: ' + err.message));
    });
  };

  // Delete a workout exercise by id (may not be needed)
module.exports.deleteWorkoutExercise = async function (id) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
      WorkoutExerciseModel.findOneAndDelete({ workoutExerciseId: id }).exec()
        .then((workoutExercise) => {
          if (workoutExercise) {
            resolve(workoutExercise);
          } else {
            reject('workout exercise record not found');
          }
        })
        .catch((err) => reject('Error deleting workout exercise: ' + err.message));
    });
  };