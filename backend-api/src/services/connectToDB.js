// connection to database uses mongoose

//required to get env variables when importing this file into another
//for some reason env variables werent loaded without it
require('dotenv').config();
const mongoose = require('mongoose');


const connection = {};    // to store our connection for checking if already connected

// get our connection string
let mongoDBConnectionString = process.env.MONGO_URL;

console.log(mongoDBConnectionString);

module.exports.connectToDb = function () {
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
