// tests/routineService.test.js

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { getRoutineById, getAllRoutines, createRoutine, updateRoutine, deleteRoutine } = require('../../src/services/routine-service');
const { createWorkout } = require('../../src/services/workout-service')
const Routine = require('../../src/schemas/Routine');
const Workout = require('../../src/schemas/Workout')
const { connectToDb } = require('../../src/services/connectToDB');
const WorkoutExercise = require('../../src/schemas/WorkoutExercise');
const { createWorkoutExercise } = require('../../src/services/workoutExercise-service');
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
    console.log("routine-service.test: afterAll called");
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


describe('Testing Routine Service Functions', () => {
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
    //set up for workout exercise testing
    const workoutExercise1 = {
      workoutExerciseId: new mongoose.Types.ObjectId(),
      workoutId: workoutData.workoutId,
      exerciseId: "Jog",
      sets: null,
      reps: null,
      duration: 30,
      weight: null,
      notes: null
    };

    //set up for workout exercise testing
    const workoutExercise2 = {
      workoutExerciseId: new mongoose.Types.ObjectId(),
      workoutId: workoutData2.workoutId,
      exerciseId: "Jog",
      sets: null,
      reps: null,
      duration: 30,
      weight: null,
      notes: null
    };

    it('creating sample workouts for the routine', async () => {
      const exercise1 = await createWorkoutExercise(workoutExercise1);
      const exercise2 = await createWorkoutExercise(workoutExercise2);
      const workout1 = await createWorkout(workoutData);
      const workout2 = await createWorkout(workoutData2);
    });
    const routineData = {
        routineId: new mongoose.Types.ObjectId(),
        routineName: 'Test Routine',
        userId: new mongoose.Types.ObjectId(),
        public: true,
        workoutIds: [workoutData.workoutId, workoutData2.workoutId]
      };

      
      let id;

      it('creating a new routine should yield correct data in DB', async () => {
        const routine = await createRoutine(routineData);
        id = routine.routineId;
        expect(routine).toHaveProperty('_id');
        expect(routine.routineId).toEqual(routineData.routineId);
        expect(routine.routineName).toBe(routineData.routineName);
        expect(routine.userId).toEqual(routineData.userId.toString());
        expect(routine.public).toBe(routineData.public);
        expect(routine.workoutIds).toEqual(expect.arrayContaining(routineData.workoutIds));
    });

    it('able to obtain routine by routineId', async () => {
      const routine = await getRoutineById(routineData.routineId);
      expect(routine).not.toBeNull();
      expect(routine.routineId).toEqual(routineData.routineId);
      expect(routine.routineName).toBe(routineData.routineName);
      expect(routine.userId).toEqual(routineData.userId.toString());
      expect(routine.public).toBe(routineData.public);
    });
  
    it('get all routines returns array and correct number', async () => {
      const routineData2 = {
        routineId: new mongoose.Types.ObjectId(),
        routineName: 'Another Routine',
        userId: new mongoose.Types.ObjectId(),
        public: false,
        workoutIds: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
      };
  
      await createRoutine(routineData2);
  
      const routines = await getAllRoutines(routineData.userId.toString());
      console.log(routines);
      expect(Array.isArray(routines)).toBe(true);
      expect(routines).toHaveLength(1);
      expect(routines[0].routineId).toEqual(routineData.routineId);
    });
  
    it('able to update routine and is persisted in DB', async () => {
      const data = {
        routineName: 'Updated Routine',
        public: false
      };
  
      const routine = await updateRoutine(routineData.routineId, data);
      expect(routine).not.toBeNull();
      expect(routine.routineId).toEqual(routineData.routineId);
      expect(routine.routineName).toBe(data.routineName);
      expect(routine.public).toBe(data.public);
  
      const updatedRoutine = await getRoutineById(routineData.routineId);
      expect(updatedRoutine).not.toBeNull();
      expect(updatedRoutine.routineId).toEqual(routineData.routineId);
      expect(updatedRoutine.routineName).toBe(data.routineName);
      expect(updatedRoutine.public).toBe(data.public);
    });
  
    it('delete a routine removes it from the database', async () => {
      await deleteRoutine(routineData.routineId);
      try {
        await getRoutineById(routineData.routineId);
      } catch (error) {
        expect(error).toBe('Routine not found');
      }
    });


 });