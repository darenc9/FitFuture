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

describe('workouts route handling', () => {
    it('/workouts should return an array of all workouts', async () => {
      const response = await request(app).get('/workouts').auth('user1@email.com', 'password1');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('workoutId');
    });

    //updated to be /workout instead of /workouts
    it('/workout/:id should return array of workout exercises', async () => {
      const response = await request(app).get(`/workout/${workout.workoutId}`).auth('user1@email.com', 'password1');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    //updated to be /workout instead of /workouts
    it('/workout/:id should return empty array if workout has no workout exercises in it yet', async () => {
      const response = await request(app).get(`/workout/${workout2.workoutId}`).auth('user1@email.com', 'password1');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });


    it('/workouts/:id should return a specific workout', async () => {
      const response = await request(app).get(`/workouts/${workout2.workoutId}`).auth('user1@email.com', 'password1');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(false);
      expect(response.body).toHaveProperty('workoutId');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('routineId');
      expect(response.body).toHaveProperty('public');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('category');
      expect(response.body.userId).toBe(null);
      expect(response.body.public).toBe(true);
      expect(response.body.workoutId).toEqual(workout2.workoutId.toString());
      expect(response.body.routineId).toEqual(workout2.routineId.toString());
      expect(response.body.name).toBe("Morning Run");
      expect(response.body.category).toBe("Cardio");
    });

    it('/workout should be able to update workout with PUT', async () => {
      const updatedWorkout = {
        workout: {
          workoutId: workout.workoutId,
          name: "Updated Morning Run",
          exerciseIds: ['Jog'],
          public: true,
          user: null
        },
        exercises : [{
          id: "Jog",
          workoutExerciseId: we.workoutExerciseId,
          name:"Jog",
          sets: null,
          reps:null,
          notes: null,
          duration: 30,
          weight: null
        }]
      }
      const response = await request(app)
      .put(`/workout`)
      .auth('user1@email.com', 'password1')
      .send(updatedWorkout);
      expect(response.status).toBe(200);
      expect(response.body.workout.name).toBe("Updated Morning Run");

      const response2 = await request(app).get(`/workouts/${workout.workoutId}`).auth('user1@email.com', 'password1');
      expect(response2.status).toBe(200);
      expect(response2.body.name).toBe("Updated Morning Run");

    });
  });

