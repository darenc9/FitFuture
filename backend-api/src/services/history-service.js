//history service utilizes history schema and connect to mongo
const mongoose = require('mongoose');
const historySchema = require('../schemas/history');

let mongoDBConnectionString = "";
let Schema = mongoose.Schema;

let History;

module.exports.connect = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString, {useNewUrlParser: true});

        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });

        db.once('open', () => {
            History = db.model("history", historySchema);
            resolve();
        });
    });
};

//get all history for a specific user
module.exports.getHistoryByUserId = function (userId) {
    return new Promise(function (resolve, reject) {
        History.find({ userId: userId }).exec()
            .then((histories) => {
                if (histories.length > 0) {
                    resolve(histories);
                } else {
                    reject('No history records found for this user');
                }
            })
            .catch((err) => reject('Error retrieving history records: ' + err.message));
    });
};

//will user need to get history by id -> this is to get one specific history entry
module.exports.getHistoryById = function (historyId) {
    return new Promise(function (resolve, reject) {
        History.findById(historyId).exec()
            .then((history) => {
                if (history) {
                    resolve(history);
                } else {
                    reject('History record not found');
                }
            })
            .catch((err) => reject('Error retrieving history record: ' + err.message));
    });
};