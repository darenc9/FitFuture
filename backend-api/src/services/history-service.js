//history service utilizes history schema and connect to mongo
const mongoose = require('mongoose');
const History = require('../schemas/History');
const { connectToDb } = require('./connectToDB');

let HistoryModel;

// Ensure connection to the database exists
const ensureConnection = async () => {
  if (!HistoryModel) {
    await connectToDb();
    HistoryModel = mongoose.model('History', History.schema);
  }
};

//get all history for a specific user
module.exports.getHistoryByUserId = async function (userId) {
  await ensureConnection();
  return new Promise(function (resolve, reject) {
    HistoryModel.find({ userId: userId }).sort({date: 'descending'}).exec()
      .then((histories) => {
        if (histories.length > 0) {
          resolve(histories);
        } else {
          resolve([]); // return an empty array if none found
        }
      })
      .catch((err) => reject('Error retrieving history records: ' + err));
  });
};

//will user need to get history by id -> this is to get one specific history entry
module.exports.getHistoryById = async function (historyId) {
  await ensureConnection();
  return new Promise(function (resolve, reject) {
    HistoryModel.findById(historyId).exec()
      .then((history) => {
        if (history) {
          resolve(history);
        } else {
          reject('History record not found');
        }
      })
      .catch((err) => reject('Error retrieving history record: ' + err));
  });
};

// create new history entry
module.exports.createHistory = async function (historyData) {
  await ensureConnection();
  return new Promise(function (resolve, reject) {
    const newHistory = new HistoryModel(historyData);
    newHistory.save()
      .then((savedHistory) => {
        resolve(savedHistory);
      })
      .catch((err) => reject('Error creating history record: ' + err));
  });
};

// delete history entry by id
module.exports.deleteHistory = async function (id) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    HistoryModel.findByIdAndDelete(id).exec()
      .then((deletedHistory) => {
        resolve(deletedHistory);
      }).catch((err) => {
        reject("Error deleting history: " + err);
      })
  });
};

// do we need to update history ever? if so, this updates a single entry by id
// update history by id
module.exports.updateHistoryById = async function (id, newData) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    HistoryModel.findByIdAndUpdate(id, newData, {new: true}).exec()
      .then((history) => {
        if (history) {
          resolve(history);
        } else {
          reject("No history record found");
        }
      }).catch((err) => {
        reject("Error updating history record: " + err );
      });
  })
};

// get the 3 most recent history entries for a specific userId and exerciseId
module.exports.getRecentHistoryByUserAndExercise = async function (userId, exerciseId) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    HistoryModel.find({ userId: userId, exerciseId: exerciseId })
      .sort({ date: 'descending' })
      .limit(3)
      .exec()
      .then((histories) => {
        resolve(histories);
      })
      .catch((err) => {
        reject('Error retrieving recent history records: ' + err);
      });
  });
};

// get the top 3 most occurring exercises for a given userId
module.exports.getMostCommonExercises = async function (userId) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    HistoryModel.aggregate([
      {$match: {userId: userId}},
      {$sortByCount: "$exerciseId"}
    ])
    .limit(3)
    .then(async (aggRes) => {
      console.debug(`Result from aggregate pipeline:`, aggRes);
      var relevantHistories = [];
      for (const ex of aggRes) {
        console.debug(`exercise id is: ${ex._id}`);
        var histories = await HistoryModel.aggregate([
          {$match: {userId: userId, exerciseId: ex._id}},
          {$project: { exerciseName: 1, date: 1, avgWeight: {$avg: ["$info.weight"]}}}
        ]);
        relevantHistories.push(...histories);
      }
      console.debug('Relevant histories are:', relevantHistories);
      resolve(relevantHistories);
    })
    .catch((err) => {
      console.error('Error retrieving top exercises from history records', err);
      reject('Error retrieving top exercises from history records: ', err);
    });
  });
};
