// tests/workoutService.test.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { createWorkout, getWorkoutById, getAllWorkouts, updateWorkout, deleteWorkout } = require('../../src/services/workout-service');
const Workout = require('../../src/schemas/Workout');
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


describe('Testing Workout Service Functions', () => {
    const workoutData = {
        workoutId: new mongoose.Types.ObjectId(),
        userId: null,
        routineId: new mongoose.Types.ObjectId(),
        public: true,
        name: 'Morning Run',
        category: 'Cardio'
      };
    let id;
  it('creating a new workout should yield correct data in DB', async () => {
    console.log("in first test");
    const workout = await createWorkout(workoutData);
    id = workout._id;
    expect(workout).toHaveProperty('_id');
    expect(workout.workoutId).toEqual(workoutData.workoutId);
    expect(workout.userId).toBe(workoutData.userId);
    expect(workout.routineId).toEqual(workoutData.routineId);
    expect(workout.public).toBe(workoutData.public);
    expect(workout.name).toBe(workoutData.name);
    expect(workout.category).toBe(workoutData.category);
  }); 

  it('newly created workout should exist in DB', async () => {

    const foundWorkout = await Workout.findById(id);
    expect(foundWorkout).not.toBeNull();
    expect(foundWorkout.workoutId).toEqual(workoutData.workoutId);
    expect(foundWorkout.userId).toBe(workoutData.userId);
    expect(foundWorkout.routineId).toEqual(workoutData.routineId);
    expect(foundWorkout.public).toBe(workoutData.public);
    expect(foundWorkout.name).toBe(workoutData.name);
    expect(foundWorkout.category).toBe(workoutData.category);
  }); 

  it('able to obtain workout by workoutId', async () => {
    const workout = await getWorkoutById(workoutData.workoutId);
    expect(workout).not.toBeNull();
    expect(workout.workoutId).toEqual(workoutData.workoutId);
    expect(workout.userId).toBe(workoutData.userId);
    expect(workout.routineId).toEqual(workoutData.routineId);
    expect(workout.public).toBe(workoutData.public);
    expect(workout.name).toBe(workoutData.name);
    expect(workout.category).toBe(workoutData.category);
  });

  it('get all workouts returns array and correct number', async () => {
    //add second workout, but false  for public to test get all workouts
    const workoutData2 = {
        workoutId: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        routineId: new mongoose.Types.ObjectId(),
        public: false,
        name: 'custom workout',
        category: 'Strength'
      };

    await createWorkout(workoutData2);

    const workouts = await getAllWorkouts();
    console.log(workouts)
    expect(Array.isArray(workouts)).toBe(true);
    expect(workouts[0].public).toBe(true);

  });

  it('able to update workout and is persisted in DB', async () => {
    data = {
        name: "updated Name",
        category: "updated Category"
    }
    //check returned workout from call
    const workout = await updateWorkout(workoutData.workoutId, data);
    expect(workout).not.toBeNull();
    expect(workout.workoutId).toEqual(workoutData.workoutId);
    expect(workout.userId).toBe(workoutData.userId);
    expect(workout.routineId).toEqual(workoutData.routineId);
    expect(workout.public).toBe(workoutData.public);
    expect(workout.name).toBe("updated Name");
    expect(workout.category).toBe("updated Category");

    //check using get by id
    const updatedWorkout = await getWorkoutById(workoutData.workoutId);
    expect(updatedWorkout).not.toBeNull();
    expect(updatedWorkout.workoutId).toEqual(workoutData.workoutId);
    expect(updatedWorkout.userId).toBe(workoutData.userId);
    expect(updatedWorkout.routineId).toEqual(workoutData.routineId);
    expect(updatedWorkout.public).toBe(workoutData.public);
    expect(updatedWorkout.name).toBe("updated Name");
    expect(updatedWorkout.category).toBe("updated Category");
  });

  it('delete a workout removes from database', async () => {
    await deleteWorkout(workoutData.workoutId);
    // Attempt to retrieve the deleted workout by ID
    try {
      await getWorkoutById(workoutData.workoutId);
    } catch (error) {
      expect(error).toBe('Workout record not found');
    }

  });


});
