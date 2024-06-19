// tests/unit/historyRoutes.test.js

const request = require('supertest');
const app = require('../../src/app');
const { connectToDb } = require('../../src/services/connectToDB');
const { default: mongoose } = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URL = uri;
  await connectToDb();
});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const col = collections[key];
    await col.deleteMany({});
  }
  await mongoose.disconnect();
  await mongoServer.stop();
})

describe('Test History Routes', () => {
  const testHistoryData = {
    userId: 'testUser',
    workoutExerciseId: new mongoose.Types.ObjectId(),
    exerciseName: 'test exercise',
    category: 'strength',
    date: new Date(),
    reps: 8,
    sets: 3,
    weight: 30,
    duration: 300,
  };

  let id;

  test('POST /history', async () => {
    await request(app).post('/history')
      .auth('user1@email.com', 'password1')
      .send(testHistoryData)
      .set('Accept', 'application/json')
      .expect(201)
      .then(res => {
        expect(res.body).toHaveProperty('_id');
        id = res.body._id;
      })
  });

  test('GET /history/:historyId returns correct history', async () => {
    const expectedWID = decodeURI(testHistoryData.workoutExerciseId);
    await request(app).get(`/history/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
        expect(res.body.workoutExerciseId).toEqual(expectedWID);
        expect(res.body.date).toEqual(testHistoryData.date.toISOString());
        expect(res.body.reps).toEqual(testHistoryData.reps);
        expect(res.body.sets).toEqual(testHistoryData.sets);
        expect(res.body.weight).toEqual(testHistoryData.weight);
        expect(res.body.duration).toEqual(testHistoryData.duration);
      })
  });

  test('PUT /history/:historyId returns updated history', async () => {
    const newData = {
      reps: 5,
    }
    await request(app).put(`/history/${id}`)
      .auth('user1@email.com', 'password1')
      .send(newData)
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
        expect(res.body.reps).toEqual(newData.reps);
      })
  });

  test('GET /histories/:userId returns list with at least one history', async () => {
    await request(app).get(`/histories/${testHistoryData.userId}`)
      .auth('user1@email.com', 'password1')
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      })
  });

  test('DELETE /history/:historyId returns deleted history', async () => {
    await request(app).delete(`/history/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Accept', 'application/json')
      .expect(201)
      .then(res => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
      });
  });

  test('GET /history/:historyId with deleted history returns error', async () => {
    await request(app).get(`/history/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Accept', 'application/json')
      .expect(404)
      .then(res => {
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('History record not found');
      })
  });
  
});
