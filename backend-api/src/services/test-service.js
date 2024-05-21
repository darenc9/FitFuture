const { connectToDb } = require('./connectToDB');
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true
  },
  desc: {
    type: String
  }
});

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);

module.exports.getTests = function() {
  return new Promise (function (resolve, reject) {
    connectToDb()
    .then(() => {
      console.log("Connected to db, trying to get Test collection");
      Test.find().exec()
      .then(tests => {
        console.log("Found tests: " + tests);
        resolve(tests);
      }).catch(err => {
        reject("Unable to get tests: " + err);
      });
    }).catch(err => {
      reject("Unable to connect to db: " + err);
    });
  });
};
