const mongoose = require('mongoose');
const connectToDB = require('../src/services/connectToDB'); // Adjust the path if necessary
const { createWorkoutExercise, getWorkoutExerciseByWorkoutId, getWorkoutExerciseById, updateWorkoutExercise, deleteWorkoutExercise } = require('../src/services/workoutExercise-service'); // Adjust the path if necessary

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
    const newWorkoutExercise = await createWorkoutExercise(workoutExerciseData);
    createdWorkoutExerciseId = newWorkoutExercise.workoutExerciseId; // Store the ID of the created workout
    console.log('Created Workout:', newWorkoutExercise);
  } catch (err) {
    console.error('Error:', err);
  }
}
async function testGetWorkoutExerciseByWorkoutId(){
  try {
    console.log('Testing get workout exercises by workout id');
    // Fetch the created workout by ID
    const workoutExercises = await getWorkoutExerciseByWorkoutId('664ad97c2562e737227fa387'); //id for upper body push workout
    console.log('Retrieved workout Exercises:', workoutExercises);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function testGetWorkoutExerciseById() {
  try {
    console.log('Testing get workout exercise by id');
    // Fetch the created workout by ID
    const workoutExercise = await getWorkoutExerciseById(createdWorkoutExerciseId);
    console.log('Retrieved Workout Exercise:', workoutExercise);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function testUpdateWorkoutExercise() {
  try {
    console.log('Testing update workout exercise');
    // Update the created workout
    const updateData = {
      notes: 'This workout exercise has been modified'
    };
    const updatedWorkoutExercise = await updateWorkoutExercise(createdWorkoutExerciseId, updateData);
    console.log('Updated Workout Exercise:', updatedWorkoutExercise);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function testDeleteWorkoutExercise() {
  try {
    console.log('Testing delete workout');
    // Delete the created workout
    const deletedWorkoutExercise = await deleteWorkoutExercise(createdWorkoutExerciseId);
    console.log('Deleted Workout Exercise:', deletedWorkoutExercise);
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
      await testGetWorkoutExerciseByWorkoutId();
      await testGetWorkoutExerciseById();
      await testUpdateWorkoutExercise();
      await testDeleteWorkoutExercise();
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