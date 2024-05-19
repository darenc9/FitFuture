
const mongoose = require('mongoose');
const connectToDB = require('../src/services/connectToDB'); // Adjust the path if necessary
const { getAllWorkouts } = require('../src/services/workout-service'); // Adjust the path if necessary

async function testGetAllWorkouts() {
  try {
    // Establish the database connection
    await connectToDB.connectToDb();
    console.log('Connected to MongoDB Atlas successfully.');

    // Fetch all workouts that are not associated with a user
    const workouts = await getAllWorkouts();
    console.log('Retrieved Workouts:', workouts);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection after the tests
    mongoose.connection.close();
  }
}

// Run the test
testGetAllWorkouts();
