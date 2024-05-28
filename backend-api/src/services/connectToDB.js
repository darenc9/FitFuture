// connection to database uses mongoose

//required to get env variables when importing this file into another
//for some reason env variables weren't loaded without it
require('dotenv').config();
const mongoose = require('mongoose');

let connection = {};    // to store our connection for checking if already connected

module.exports.connectToDb = function () {
  // get our connection string
const mongoDBConnectionString = process.env.MONGO_URL;
console.log("connect to DB: " + mongoDBConnectionString);

  return new Promise((resolve, reject) => {
    if (connection.isConnected) {
      console.log("Using existing connection");
      resolve(connection);
    }
    mongoose.connect(mongoDBConnectionString)
      .then(() => {
        connection = mongoose.connection;
        connection.isConnected = mongoose.connection.readyState;
        resolve(connection);
      }).catch(err => {
        console.log("error connecting to database");
        reject(err);
      })
    
  })
}
