// tests/unit/profileRoutes.test.js

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

describe('Test Profile Routes', () => {
  const testProfileData = {
    userId: 'testUser',
    dob: new Date(),
    height: 178,
    weight: 180,
    sex: 'Male',
    fitnessLevel: 'Intermediate',
    favourites: {
      exercises: [],
      workouts: [],
      routines: [],
    }
  };
  let id;

  test('POST /profile/create', async () => {
    await request(app).post('/profile/create')
      .send(testProfileData)
      .set('Accept', 'application/json')
      .expect(201)
      .then(res => {
        expect(res.body).toHaveProperty('_id');
        id = res.body._id;
      })
  });

  test('GET /profile/:profileId returns correct profile', async () => {
    await request(app).get(`/profile/${id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
        expect(res.body.dob).toEqual(testProfileData.dob.toISOString());
        expect(res.body.height).toEqual(testProfileData.height);
        expect(res.body.weight).toEqual(testProfileData.weight);
        expect(res.body.sex).toEqual(testProfileData.sex);
        expect(res.body.fitnessLevel).toEqual(testProfileData.fitnessLevel);
      })
  });

  test('PUT /profile/:profileId returns updated profile', async () => {
    const newData = {
      height: 179,
      weight: 185,
    }
    await request(app).put(`/profile/${id}`)
      .send(newData)
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
        expect(res.body.height).toEqual(newData.height);
        expect(res.body.weight).toEqual(newData.weight);
      })
  });

  test('GET /profiles returns list with at least one profile', async () => {
    await request(app).get(`/profiles`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      })
  });

  test('DELETE /profile/:profileId returns deleted profile', async () => {
    await request(app).delete(`/profile/${id}`)
      .set('Accept', 'application/json')
      .expect(201)
      .then(res => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
      });
  });

  test('GET /profile/:profileId with deleted profile returns error', async () => {
    await request(app).get(`/profile/${id}`)
      .set('Accept', 'application/json')
      .expect(404)
      .then(res => {
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('No profile record found');
      })
  });
  
});
