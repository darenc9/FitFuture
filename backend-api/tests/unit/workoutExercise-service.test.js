// tests/workoutService.test.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { getWorkoutExerciseByWorkoutId, getWorkoutExerciseById, createWorkoutExercise, updateWorkoutExercise, deleteWorkoutExercise  } = require('../../src/services/workoutExercise-service');
const {createWorkout } = require('../../src/services/workout-service');
const WorkoutExercise = require('../../src/schemas/WorkoutExercise');

const { connectToDb } = require('../../src/services/connectToDB');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log("In-memory MongoDB URI:", uri);
  process.env.MONGO_URL = uri;
  console.log("MONGO_URL env variable:", process.env.MONGO_URL);
  await connectToDb(); // Use the updated connectToDb function
}); 

afterAll(async () => {
    console.log("after all called");
    // Get all collections in the current MongoDB connection
    const collections = mongoose.connection.collections;
    // Loop through all collections and delete all documents within them
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  // Disconnect from the MongoDB server
  await mongoose.disconnect();

// Stop the in-memory MongoDB server
  await mongoServer.stop();
});

describe('Testing WorkoutExercise Service Functions', () => {
    //create workout for testing later functions
    const workout = {
        workoutId: new mongoose.Types.ObjectId(),
        userId: null,
        routineId: new mongoose.Types.ObjectId(),
        public: true,
        name: 'Morning Run',
        category: 'Cardio'
    };

    //set up for workout exercise testing
    const workoutExercise1 = {
        workoutExerciseId: new mongoose.Types.ObjectId(),
        workoutId: workout.workoutId,
        exerciseId: "Jog",
        sets: null,
        reps: null,
        duration: 30,
        weight: null,
        notes: null
    };
    let id1;

  it('creating a new workout exercise should yield correct data in DB', async () => {
    console.log("in first test");
    await createWorkout(workout);
    const workoutExercise = await createWorkoutExercise(workoutExercise1);
    id1 = workoutExercise._id;
    expect(workoutExercise).toHaveProperty('_id');
    expect(workoutExercise.workoutExerciseId).toEqual(workoutExercise1.workoutExerciseId);
    expect(workoutExercise.workoutId).toEqual(workoutExercise1.workoutId);
    expect(workoutExercise.exerciseId).toEqual(workoutExercise1.exerciseId);
    expect(workoutExercise.sets).toEqual(workoutExercise1.sets);
    expect(workoutExercise.reps).toEqual(workoutExercise1.reps);
    expect(workoutExercise.duration).toEqual(workoutExercise1.duration);
    expect(workoutExercise.weight).toEqual(workoutExercise1.weight);
    expect(workoutExercise.notes).toEqual(workoutExercise1.notes);
  }); 

  it('newly created workout exercise should exist in DB', async () => {
    const we = await WorkoutExercise.findById(id1);
    expect(we).not.toBeNull();
    expect(we.workoutExerciseId).toEqual(workoutExercise1.workoutExerciseId);
    expect(we.workoutId).toEqual(workoutExercise1.workoutId);
    expect(we.exerciseId).toEqual(workoutExercise1.exerciseId);
    expect(we.sets).toEqual(workoutExercise1.sets);
    expect(we.reps).toEqual(workoutExercise1.reps);
    expect(we.duration).toEqual(workoutExercise1.duration);
    expect(we.weight).toEqual(workoutExercise1.weight);
    expect(we.notes).toEqual(workoutExercise1.notes);
  }); 

  it('able to obtain workout exercise by workoutExerciseId', async () => {
    const we = await getWorkoutExerciseById(workoutExercise1.workoutExerciseId);
    expect(we).not.toBeNull();
    expect(we.workoutExerciseId).toEqual(workoutExercise1.workoutExerciseId);
    expect(we.workoutId).toEqual(workoutExercise1.workoutId);
    expect(we.exerciseId).toEqual(workoutExercise1.exerciseId);
    expect(we.sets).toEqual(workoutExercise1.sets);
    expect(we.reps).toEqual(workoutExercise1.reps);
    expect(we.duration).toEqual(workoutExercise1.duration);
    expect(we.weight).toEqual(workoutExercise1.weight);
    expect(we.notes).toEqual(workoutExercise1.notes);
  });

  it('get all workout exercise by workout id returns array, correct number and right w.e', async () => {
    const workoutExercise2 = {
        workoutExerciseId: new mongoose.Types.ObjectId(),
        workoutId: workout.workoutId,
        exerciseId: "Sprint",
        sets: null,
        reps: null,
        duration: 10,
        weight: null,
        notes: null
    };
    const checkIds = [workoutExercise1.workoutExerciseId, workoutExercise2.workoutExerciseId];


    await createWorkoutExercise(workoutExercise2);

    const workoutExercises = await getWorkoutExerciseByWorkoutId(workout.workoutId);
// Check if workoutExercises is an array
expect(Array.isArray(workoutExercises)).toBe(true);

// Check if the length of workoutExercises is 2
expect(workoutExercises.length).toBe(2);

// Map through the workoutExercises to get an array of workoutExerciseIds
const idsInData = workoutExercises.map(item => item.workoutExerciseId);

// Loop through each id in checkIds and check if it's contained in idsInData
checkIds.forEach(id => {
  expect(idsInData).toContainEqual(id);
});
  });

  it('able to update workout exercise and is persisted in DB', async () => {
    data = {
        exerciseId: "updated exercise",
        notes: "updated notes"
    }
    //check returned workout from call
    const we = await updateWorkoutExercise(workoutExercise1.workoutExerciseId, data);
    expect(we).not.toBeNull();
    expect(we.workoutExerciseId).toEqual(workoutExercise1.workoutExerciseId);
    expect(we.workoutId).toEqual(workoutExercise1.workoutId);
    expect(we.exerciseId).toEqual("updated exercise");
    expect(we.sets).toEqual(workoutExercise1.sets);
    expect(we.reps).toEqual(workoutExercise1.reps);
    expect(we.duration).toEqual(workoutExercise1.duration);
    expect(we.weight).toEqual(workoutExercise1.weight);
    expect(we.notes).toEqual("updated notes");

    //check using get by id
    const updatedWe = await getWorkoutExerciseById(workoutExercise1.workoutExerciseId);
    expect(updatedWe.workoutExerciseId).toEqual(workoutExercise1.workoutExerciseId);
    expect(updatedWe.workoutId).toEqual(workoutExercise1.workoutId);
    expect(updatedWe.exerciseId).toEqual("updated exercise");
    expect(updatedWe.sets).toEqual(workoutExercise1.sets);
    expect(updatedWe.reps).toEqual(workoutExercise1.reps);
    expect(updatedWe.duration).toEqual(workoutExercise1.duration);
    expect(updatedWe.weight).toEqual(workoutExercise1.weight);
    expect(updatedWe.notes).toEqual("updated notes");
  });

  it('delete a workoutExercise removes from database', async () => {
    await deleteWorkoutExercise(workoutExercise1.workoutExerciseId);
    // Attempt to retrieve the deleted workout by ID
    try {
      await getWorkoutExerciseById(workoutExercise1.workoutExerciseId);
    } catch (error) {
      expect(error).toBe('workout exercise record not found');
    }
  });


});
