const mongoose = require('mongoose');
const connectToDB = require('../src/services/connectToDB'); // Adjust the path if necessary
const { createWorkout, getByWorkoutId, getWorkoutExerciseById, updateWorkoutExercise, deleteWorkoutExercise } = require('../src/services/workoutExercise-service'); // Adjust the path if necessary

let createdWorkoutExerciseId; // Variable to store the ID of the created workout

async function testCreateWorkoutExercise() {
  try {
    console.log('Testing create a workout Exercise');
    // Create a new workout
    const workoutExerciseData = {
          workoutExerciseId: new mongoose.Types.ObjectId(),
          workoutId: new mongoose.Types.ObjectId(), 
          exerciseId: "Sit ups",
          sets: 3,
          reps: 12,
          duration: null, 
          weight: null,
          notes: null
    };
    const newWorkoutExercise = await createWorkout(workoutExerciseData);
    createdWorkoutExerciseId = newWorkoutExercise.workoutExerciseId; // Store the ID of the created workout
    console.log('Created Workout:', newWorkout);
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
      await testCreateWorkoutExercise();
        
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