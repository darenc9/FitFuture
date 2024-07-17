// tests/unit/routineRoutes.test.js

const request = require('supertest');
const app = require('../../src/app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { createRoutine } = require('../../src/services/routine-service');
const { connectToDb } = require('../../src/services/connectToDB');

let mongoServer;
let routine1;
let routine2;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log("In-memory MongoDB URI:", uri);
  process.env.MONGO_URL = uri;
  console.log("MONGO_URL env variable:", process.env.MONGO_URL);
  await connectToDb();

  const routineData1 = {
    routineId: new mongoose.Types.ObjectId(),
    routineName: 'Test Routine 1',
    userId: new mongoose.Types.ObjectId(),
    public: true,
    workouts: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
  };

  const routineData2 = {
    routineId: new mongoose.Types.ObjectId(),
    routineName: 'Test Routine 2',
    userId: new mongoose.Types.ObjectId(),
    public: true,
    workouts: []
  };

  routine1 = await createRoutine(routineData1);
  routine2 = await createRoutine(routineData2);
});

afterAll(async () => {
  console.log("after all called");
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('routine routes handling', () => {
  it('/routines should return an array of all routines', async () => {
    const response = await request(app).get('/routines').auth('user1@email.com', 'password1');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('routineId');
  });

  it('/routine/:routineid should return a specific routine by id', async () => {
    const response = await request(app).get(`/routine/${routine1.routineId}`).auth('user1@email.com', 'password1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('routineId');
    expect(response.body.routineId).toEqual(routine1.routineId.toString());
  });

  it('POST /routines should create a new routine', async () => {
    const newRoutineData = {
      routineName: 'New Test Routine',
      userId: new mongoose.Types.ObjectId(),
      public: true,
      workouts: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
    };

    const response = await request(app)
      .post('/routines')
      .send(newRoutineData)
      .auth('user1@email.com', 'password1');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.routineName).toBe(newRoutineData.routineName);
  });

  it('PUT /routines/:routineid should update an existing routine', async () => {
    const updateData = {
      routineName: 'Updated Test Routine'
    };

    const response = await request(app)
      .put(`/routines/${routine1.routineId}`)
      .send(updateData)
      .auth('user1@email.com', 'password1');

    expect(response.status).toBe(200);
    expect(response.body.routineName).toBe(updateData.routineName);
  });
});
