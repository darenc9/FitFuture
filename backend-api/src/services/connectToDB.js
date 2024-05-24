// connection to database uses mongoose

//required to get env variables when importing this file into another
//for some reason env variables werent loaded without it
require('dotenv').config();
const mongoose = require('mongoose');


const connection = {};    // to store our connection for checking if already connected



module.exports.connectToDb = function () {
  // get our connection string
const mongoDBConnectionString = process.env.MONGO_URL;
console.log("connect to DB: " + mongoDBConnectionString);

  return new Promise((resolve, reject) => {
    if (connection.isConnected) {
      console.log("Using existing connection");
      resolve();
    }
    mongoose.connect(mongoDBConnectionString)
      .then(() => {
        connection.isConnected = mongoose.connection.readyState;
        resolve();
      }).catch(err => {
        console.log("error connecting to database");
        reject(err);
      })
    
  })
}
