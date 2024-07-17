const mongoose = require('mongoose');
const Routine = require('../schemas/Routine');
const { connectToDb } = require('./connectToDB');
const { getWorkoutById } = require('./workout-service');

let RoutineModel;

// Ensure the database connection is established and the model is set up
const ensureConnection = async () => {
    if (!RoutineModel) {
      await connectToDb();
      RoutineModel = mongoose.model('Routine', Routine.schema);
    }
  };


// Gets routine by ID with populated workout details
module.exports.getRoutineById = async function (id) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
      RoutineModel.findOne({ routineId: id })
          .exec()
          .then(async (routine) => {
              if (!routine) {
                  return reject('Routine not found');
              }

              // Map over workoutIds and fetch detailed workout information
              const populatedWorkouts = await Promise.all(
                  routine.workoutIds.map(async (workoutId) => {
                      try {
                          const workout = await getWorkoutById(workoutId); // Use getWorkoutById from workout-service.js
                          return workout;
                      } catch (error) {
                          throw new Error(`Failed to fetch workout details for ID ${workoutId}: ${error.message}`);
                      }
                  })
              );

              // Replace workoutIds with populated workouts array
              routine.workouts = populatedWorkouts;

              resolve(routine);
          })
          .catch((err) => reject('Error retrieving routine: ' + err.message));
  });
};

//get all routines that are not associated with a user (ie all preset routine)
//userId should be null
module.exports.getAllRoutines = async function (user) {
  //const userId = user.toString();
  console.log("in get all routines: " + user);
    await ensureConnection();
    return new Promise((resolve, reject) => {
      const query = {
        $or: [
          { public: true },
          { userId: user }
        ]
      };
      RoutineModel.find(query).exec()
        .then((routines) => {
          if (routines.length > 0) {
            resolve(routines);
          } else {
            reject('No routines found where public or userid is ' + user);
          }
        })
        .catch((err) => reject('Error retrieving workout records: ' + err.message));
    });
  };

// Create a new Routine
module.exports.createRoutine = async function (routineData) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
        const routine = new RoutineModel(routineData);
        routine.save()
            .then((savedRoutine) => resolve(savedRoutine))
            .catch((err) => reject('Error creating Routine record: ' + err.message));
    });
  };


// To update existing routine
module.exports.updateRoutine = async function (id, updateData) {
    await ensureConnection();
    return new Promise((resolve, reject) => {
      RoutineModel.findOneAndUpdate({ routineId: id }, updateData, { new: true }).exec()
        .then((routine) => {
          if (routine) {
            resolve(routine);
          } else {
            reject('Routine record not found');
          }
        })
        .catch((err) => reject('Error updating routine record: ' + err.message));
    });
  };

// Delete a routine by its ID
module.exports.deleteRoutine = async function (id) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    RoutineModel.findOneAndDelete({ routineId: id }).exec()
      .then((routine) => {
        if (routine) {
          resolve(routine);
        } else {
          reject('Routine record not found');
        }
      })
      .catch((err) => reject('Error deleting routine record: ' + err.message));
  });
};