const mongoose = require('mongoose');
const connectToDB = require('../src/services/connectToDB'); // Adjust the path if necessary
const { createWorkout, getAllWorkouts, getWorkoutById, updateWorkout, deleteWorkout } = require('../src/services/workout-service'); // Adjust the path if necessary

let createdWorkoutId; // Variable to store the ID of the created workout

async function testCreateWorkout() {
  try {
    console.log('Testing create a workout');
    // Create a new workout
    const workoutData = {
      workoutId: new mongoose.Types.ObjectId(), // Generate a new ObjectId for workoutId
      userId: null,
      routineId: null,
      name: 'Test Workout',
      category: 'Test Category'
    };
    const newWorkout = await createWorkout(workoutData);
    createdWorkoutId = newWorkout.workoutId; // Store the ID of the created workout
    console.log('Created Workout:', newWorkout);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function testGetAllWorkouts() {
  try {
    console.log('Testing get all workouts');
    // Fetch all workouts that are not associated with a user
    const workouts = await getAllWorkouts();
    console.log('Retrieved Workouts:', workouts);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function testGetWorkoutById() {
  try {
    console.log('Testing get workout by id');
    // Fetch the created workout by ID
    const workout = await getWorkoutById(createdWorkoutId);
    console.log('Retrieved Workout:', workout);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function testUpdateWorkout() {
  try {
    console.log('Testing update workout');
    // Update the created workout
    const updateData = {
      name: 'Updated Workout Name',
      category: 'Updated Category'
    };
    const updatedWorkout = await updateWorkout(createdWorkoutId, updateData);
    console.log('Updated Workout:', updatedWorkout);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function testDeleteWorkout() {
  try {
    console.log('Testing delete workout');
    // Delete the created workout
    const deletedWorkout = await deleteWorkout(createdWorkoutId);
    console.log('Deleted Workout:', deletedWorkout);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the tests in sequence
async function runTests() {
  try {
    // Establish the database connection
    await connectToDB.connectToDb();
    console.log('Connected to MongoDB Atlas successfully.');

    // Run the tests in sequence
    await testCreateWorkout();
    await testGetAllWorkouts();
    await testGetWorkoutById();
    await testUpdateWorkout();
    await testDeleteWorkout();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection after the tests
    mongoose.connection.close();
    console.log('Disconnected from MongoDB Atlas.');
  }
}

// Run the tests
runTests();
