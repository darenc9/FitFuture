//history service utilizes history schema and connect to mongo
const mongoose = require('mongoose');
const History = require('../schemas/history');
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
    HistoryModel.find({ userId: userId }).exec()
      .then((histories) => {
        if (histories.length > 0) {
          resolve(histories);
        } else {
          reject(`No history records found for user ${userId}`);
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
