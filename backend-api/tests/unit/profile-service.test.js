// tests/unit/profile-service.test.js

const { MongoMemoryServer } = require("mongodb-memory-server");
const { connectToDb } = require("../../src/services/connectToDB");
const { default: mongoose } = require("mongoose");
const { createProfile, getProfileById, getProfileByUserId, getAllProfiles, deleteProfile, updateProfileById, updateFavourites } = require("../../src/services/profile-service");
const Profile = require("../../src/schemas/Profile");

// set up in-memory server for running tests:
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
    await col.deleteMany({});   // delete all the docs in the collection
  }
  // disconnect
  await mongoose.disconnect();
  // stop the in-memory server used for tests
  await mongoServer.stop();
});

// the tests:
describe('Test Profile service functions', () => {
  const testProfileData = {
    userId: 'testUser',
    dob: new Date(),
    height: 178,
    weight: [180],
    sex: 'Male',
    fitnessLevel: 'Intermediate',
    favourites: {
      exercises: [],
      workouts: [],
      routines: [],
    }
  };
  let id;   // to store created test's _id attribute

  test('creating a new profile should contain correct data', async () => {
    const testProfile = await createProfile(testProfileData);
    expect(testProfile).toHaveProperty('_id');
    id = testProfile._id;   // update the id with the generated _id attribute of newly created profile
    expect(testProfile.userId).toEqual(testProfileData.userId);
    expect(testProfile.dob).toEqual(testProfileData.dob);
    expect(testProfile.height).toEqual(testProfileData.height);
    expect(testProfile.weight).toEqual(testProfileData.weight);
    expect(testProfile.sex).toEqual(testProfileData.sex);
    expect(testProfile.fitnessLevel).toEqual(testProfileData.fitnessLevel);
    expect(Array.isArray(testProfile.favourites.exercises)).toBe(true);
    expect(Array.isArray(testProfile.favourites.workouts)).toBe(true);
    expect(Array.isArray(testProfile.favourites.routines)).toBe(true);
  });
  
  test('newly created profile should exist in db', async () => {
    const foundTestProfile = await Profile.findById(id);  // pass the saved _id attribute to check
    expect(foundTestProfile).not.toBeNull();  // should successfully find the profile
  });

  test('getting profile by profile id should contain correct data', async () => {
    const foundTestProfile = await getProfileById(id);
    expect(foundTestProfile.userId).toEqual(testProfileData.userId);
    expect(foundTestProfile.dob).toEqual(testProfileData.dob);
    expect(foundTestProfile.height).toEqual(testProfileData.height);
    expect(foundTestProfile.weight).toEqual(testProfileData.weight);
    expect(foundTestProfile.sex).toEqual(testProfileData.sex);
    expect(foundTestProfile.fitnessLevel).toEqual(testProfileData.fitnessLevel);
    expect(Array.isArray(foundTestProfile.favourites.exercises)).toBe(true);
    expect(Array.isArray(foundTestProfile.favourites.workouts)).toBe(true);
    expect(Array.isArray(foundTestProfile.favourites.routines)).toBe(true);
  });

  test('getting profile by user id should contain correct data', async () => {
    const foundTestProfile = await getProfileByUserId(testProfileData.userId);
    expect(foundTestProfile._id).toEqual(id);
    expect(foundTestProfile.userId).toEqual(testProfileData.userId);
    expect(foundTestProfile.dob).toEqual(testProfileData.dob);
    expect(foundTestProfile.height).toEqual(testProfileData.height);
    expect(foundTestProfile.weight).toEqual(testProfileData.weight);
    expect(foundTestProfile.sex).toEqual(testProfileData.sex);
    expect(foundTestProfile.fitnessLevel).toEqual(testProfileData.fitnessLevel);
    expect(Array.isArray(foundTestProfile.favourites.exercises)).toBe(true);
    expect(Array.isArray(foundTestProfile.favourites.workouts)).toBe(true);
    expect(Array.isArray(foundTestProfile.favourites.routines)).toBe(true);
  });

  test('get all profiles returns correct number of profiles', async () => {
    // add another profile so we have more than one to retrieve from db for getAll
    const testProfileData2 = {
      userId: 'user2',
      dob: new Date(),
      height: 183,
      weight: 176,
      sex: 'Female',
      fitnessLevel: 'Advanced',
      favourites: {
        exercises: [],
        workouts: [],
        routines: [],
      }
    };
    await createProfile(testProfileData2);

    // get all (both) profiles to check
    const allTestProfiles = await getAllProfiles();
    expect(Array.isArray(allTestProfiles)).toBe(true);
    expect(allTestProfiles.length).toEqual(2);
    expect(allTestProfiles[0].userId).toEqual(testProfileData.userId);  // check that the first one is the first test profile
    expect(allTestProfiles[1].userId).toEqual(testProfileData2.userId);  // check that the second is the second test profile
  });

  test('updating a profile should contain correct data', async () => {
    const updatedData = {
      height: 175,
      weight: [180, 170],
    };

    const testProfile = await updateProfileById(id, updatedData);
    expect(testProfile.userId).toEqual(testProfileData.userId);
    expect(testProfile.dob).toEqual(testProfileData.dob);
    expect(testProfile.height).toEqual(updatedData.height);   // only updated values should change
    expect(testProfile.weight).toEqual(updatedData.weight);   // only updated values should change
    expect(testProfile.sex).toEqual(testProfileData.sex);
    expect(testProfile.fitnessLevel).toEqual(testProfileData.fitnessLevel);
    expect(Array.isArray(testProfile.favourites.exercises)).toBe(true);
    expect(Array.isArray(testProfile.favourites.workouts)).toBe(true);
    expect(Array.isArray(testProfile.favourites.routines)).toBe(true);
  });

  test('updating a profiles favourites should contain correct data', async () => {
    const updatedFavs = {
      exercises: [],
      workouts: ['1234'],
      routines: []
    };

    const testProfile = await updateFavourites(id, updatedFavs);
    expect(testProfile.userId).toEqual(testProfileData.userId);
    expect(testProfile.dob).toEqual(testProfileData.dob);
    expect(testProfile.height).toEqual(175);
    expect(testProfile.weight).toEqual([180, 170]);
    expect(testProfile.sex).toEqual(testProfileData.sex);
    expect(testProfile.fitnessLevel).toEqual(testProfileData.fitnessLevel);
    expect(Array.isArray(testProfile.favourites.exercises)).toBe(true);
    expect(Array.isArray(testProfile.favourites.workouts)).toBe(true);
    expect(testProfile.favourites.workouts).toHaveLength(1);
    expect(testProfile.favourites.workouts[0]).toEqual('1234');
    expect(Array.isArray(testProfile.favourites.routines)).toBe(true);
  });

  test('deleting a profile removes it from db', async () => {
    const deleteResponse = await deleteProfile(id);   // delete the first test profile
    expect(deleteResponse).not.toBeNull();
    // attempting to retrieve deleted profile should fail
    try {
      expect(await getProfileById(id)).rejects.toBe(true);  // get profile should reject
    } catch (error) {
      expect(error).toBe('No profile record found');        // with the right error
    };
  });

});
