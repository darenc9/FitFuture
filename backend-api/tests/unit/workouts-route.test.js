const request = require('supertest');
const app = require('../../src/app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const {createWorkout } = require('../../src/services/workout-service');
const {createWorkoutExercise } = require('../../src/services/workoutExercise-service');
const { connectToDb } = require('../../src/services/connectToDB');

let mongoServer;
let workout;
let workout2;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log("In-memory MongoDB URI:", uri);
  process.env.MONGO_URL = uri;
  console.log("MONGO_URL env variable:", process.env.MONGO_URL);
  await connectToDb(); // Use the updated connectToDb function

  const workoutData = {
    workoutId: new mongoose.Types.ObjectId(),
    userId: null,
    routineId: new mongoose.Types.ObjectId(),
    public: true,
    name: 'Morning Run',
    category: 'Cardio'
  };

  const workoutData2 = {
    workoutId: new mongoose.Types.ObjectId(),
    userId: null,
    routineId: new mongoose.Types.ObjectId(),
    public: true,
    name: 'Morning Run',
    category: 'Cardio'
  };
  workout = await createWorkout(workoutData);
  workout2 = await createWorkout(workoutData2);

  const weData = {
    workoutExerciseId: new mongoose.Types.ObjectId(),
    workoutId: workout.workoutId,
    exerciseId: "Jog",
    sets: null,
    reps: null,
    duration: 30,
    weight: null,
    notes: null
  };
  
  we = await createWorkoutExercise(weData);

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
// Tests accessing a nonexistent route
describe('workouts route handling', () => {
    it('/workouts should return an array of all workouts', async () => {
      const response = await request(app).get('/workouts');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('workoutId');
    });

    it('/workouts/:id should return array of workout exercises', async () => {
      const response = await request(app).get(`/workouts/${workout.workoutId}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/workouts/:id should return empty array if workout has no workout exercises in it yet', async () => {
      const response = await request(app).get(`/workouts/${workout2.workoutId}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });