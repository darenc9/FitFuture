// tests/unit/history-service.test.js

const { MongoMemoryServer } = require("mongodb-memory-server");
const { connectToDb } = require("../../src/services/connectToDB");
const { default: mongoose } = require("mongoose");
const History = require("../../src/schemas/History");
const { createHistory, getHistoryById, getHistoryByUserId, updateHistoryById, deleteHistory } = require("../../src/services/history-service");

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
describe('Test History service functions', () => {
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

  let id;   // to store created test's _id attribute

  test('creating a new history should contain correct data', async () => {
    const testHistory = await createHistory(testHistoryData);
    expect(testHistory).toHaveProperty('_id');
    id = testHistory._id;   // update the id with the generated _id attribute of newly created history
    expect(testHistory.userId).toEqual(testHistoryData.userId);
    expect(testHistory.workoutExerciseId).toEqual(testHistoryData.workoutExerciseId);
    expect(testHistory.exerciseName).toEqual(testHistoryData.exerciseName);
    expect(testHistory.category).toEqual(testHistoryData.category);
    expect(testHistory.date).toEqual(testHistoryData.date);
    expect(testHistory.reps).toEqual(testHistoryData.reps);
    expect(testHistory.sets).toEqual(testHistoryData.sets);
    expect(testHistory.weight).toEqual(testHistoryData.weight);
    expect(testHistory.duration).toEqual(testHistoryData.duration);
  });
  
  test('newly created history should exist in db', async () => {
    const foundTestHistory = await History.findById(id);  // pass the saved _id attribute to check
    expect(foundTestHistory).not.toBeNull();  // should successfully find the history
  });

  test('getting history by history id should contain correct data', async () => {
    const foundTestHistory = await getHistoryById(id);
    expect(foundTestHistory.userId).toEqual(testHistoryData.userId);
    expect(foundTestHistory.workoutExerciseId).toEqual(testHistoryData.workoutExerciseId);
    expect(foundTestHistory.exerciseName).toEqual(testHistoryData.exerciseName);
    expect(foundTestHistory.category).toEqual(testHistoryData.category);
    expect(foundTestHistory.date).toEqual(testHistoryData.date);
    expect(foundTestHistory.reps).toEqual(testHistoryData.reps);
    expect(foundTestHistory.sets).toEqual(testHistoryData.sets);
    expect(foundTestHistory.weight).toEqual(testHistoryData.weight);
    expect(foundTestHistory.duration).toEqual(testHistoryData.duration);
  });

  test('get all history for userId returns correct number of history entries', async () => {
    // add another history so we have more than one to retrieve from db for getAll
    const testHistoryData2 = {
      userId: 'testUser',
      workoutExerciseId: new mongoose.Types.ObjectId(),
      exerciseName: 'test exercise 2',
      category: 'cardio',
      date: new Date(),
      reps: 10,
      sets: 4,
      weight: 15,
      duration: 600,
    };
    await createHistory(testHistoryData2);

    // get all (both) histories to check
    const allTestHistories = await getHistoryByUserId('testUser');
    expect(Array.isArray(allTestHistories)).toBe(true);
    expect(allTestHistories).toHaveLength(2);
  });

  test('get all history for userId returns history in order from newest-oldest', async () => {
    // add another history with old date to see it come last
    const testHistoryData3 = {
      userId: 'testUser',
      workoutExerciseId: new mongoose.Types.ObjectId(),
      exerciseName: 'oldest entry',
      category: 'strength',
      date: new Date('2024-01-01'),
      reps: 12,
      sets: 3,
      weight: 15,
      duration: 0,
    };
    // add another history with newer date
    const testHistoryData4 = {
      userId: 'testUser',
      workoutExerciseId: new mongoose.Types.ObjectId(),
      exerciseName: 'newer entry',
      category: 'strength',
      date: new Date('2024-05-01'),
      reps: 12,
      sets: 3,
      weight: 15,
      duration: 0,
    };
    await createHistory(testHistoryData3);
    await createHistory(testHistoryData4);

    // get all histories to check
    const allTestHistories = await getHistoryByUserId('testUser');
    expect(Array.isArray(allTestHistories)).toBe(true);
    // expect(allTestHistories.length).toEqual(4);
    expect(allTestHistories).toHaveLength(4);
    expect(allTestHistories[3].exerciseName).toEqual(testHistoryData3.exerciseName);  // check that the last one is the oldest entry
  });

  test('get all history for non-existent userId returns empty array', async () => {
    // try {
    //   expect(await getHistoryByUserId('doesNotExist')).rejects.toBe(true);
    // } catch (error) {
    //   expect(error).toBe('No history records found for user doesNotExist');
    // }
    const histories = await getHistoryByUserId('doesNotExist');
    expect(Array.isArray(histories)).toBe(true);
    expect(histories).toHaveLength(0);
  });

  test('updating a history entry should contain correct data', async () => {
    const updatedData = {
      reps: 5,
    };

    const testHistory = await updateHistoryById(id, updatedData);

    expect(testHistory.userId).toEqual(testHistoryData.userId);
    expect(testHistory.workoutExerciseId).toEqual(testHistoryData.workoutExerciseId);
    expect(testHistory.exerciseName).toEqual(testHistoryData.exerciseName);
    expect(testHistory.category).toEqual(testHistoryData.category);
    expect(testHistory.date).toEqual(testHistoryData.date);
    expect(testHistory.reps).toEqual(updatedData.reps);   // only updated values should change
    expect(testHistory.sets).toEqual(testHistoryData.sets);
    expect(testHistory.weight).toEqual(testHistoryData.weight);
    expect(testHistory.duration).toEqual(testHistoryData.duration);
  });

  test('updating a non-existent history rejects', async () => {
    const updatedData = {
      reps: 5,
    };
    try {
      expect(await updateHistoryById('1234', updatedData)).rejects.toBe(true);
    } catch (error) {
      expect(error).toContain('Error updating history record: ');
    }
  });

  test('deleting a history entry removes it from db', async () => {
    const deleteResponse = await deleteHistory(id);   // delete the first test history entry
    expect(deleteResponse).not.toBeNull();
    // attempting to retrieve deleted history should fail
    try {
      expect(await getHistoryById(id)).rejects.toBe(true);  // get history should reject
    } catch (error) {
      expect(error).toBe('History record not found');        // with the right error
    };
  });

});
