//history service utilizes history schema and connect to mongo
const mongoose = require('mongoose');
const RoutineHistory = require('../schemas/RoutineHistory');
const { connectToDb } = require('./connectToDB');

let RoutineHistoryModel;

// Ensure connection to the database exists
const ensureConnection = async () => {
  if (!RoutineHistoryModel) {
    await connectToDb();
    RoutineHistoryModel = mongoose.model('RoutineHistory', RoutineHistory.schema);
  }
};

// get history entry by userId and routineId, create if it doesn't exist
module.exports.getOrCreateRoutineHistoryByUserAndRoutine = async function (userId, routineId) {
    await ensureConnection();
    return new Promise(function (resolve, reject) {
      RoutineHistoryModel.findOne({ userId: userId, routineId: routineId })
        .then((routineHistory) => {
          if (routineHistory) {
            resolve(routineHistory);
          } else {
            // If not found, create a new entry with all necessary fields
            const newRoutineHistory = new RoutineHistoryModel({
                userId,
                routineId,
                completed: [],
                routineHistoryId: new mongoose.Types.ObjectId(),
            });
            newRoutineHistory.save()
              .then((savedRoutineHistory) => {
                resolve(savedRoutineHistory);
              })
              .catch((err) => reject('Error creating routine history record: ' + err));
          }
        })
        .catch((err) => reject('Error fetching routine history record: ' + err));
    });
  };

  //update routineHistory
  module.exports.updateRoutineHistory = async function (routineHistoryId, completedArray) {
    await ensureConnection();
    console.log("in service function");
    console.log(routineHistoryId);
    console.log(completedArray);
    return new Promise(function (resolve, reject) {
      RoutineHistoryModel.findOneAndUpdate(
        { routineHistoryId: routineHistoryId },
        { $set: { completed: completedArray } },
        { new: true }
      )
        .then((updatedRoutineHistory) => {
          if (updatedRoutineHistory) {
            resolve(updatedRoutineHistory);
          } else {
            reject('Routine history record not found');
          }
        })
        .catch((err) => reject('Error updating routine history record: ' + err));
    });
  };