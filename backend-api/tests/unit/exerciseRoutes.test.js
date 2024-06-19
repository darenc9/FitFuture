// tests/unit/exerciseRoutes.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('Exercise Routes', () => {
    test('should return a list of exercises with default pagination', async () => {
        const response = await request(app).get('/exercises').auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(10); // Assuming default limit is 10
        expect(response.body.total).toBeGreaterThanOrEqual(response.body.data.length);
    });

    test('should return a list of exercises with custom pagination', async () => {
        const page = 2;
        const limit = 5;
        const response = await request(app).get(`/exercises?page=${page}&limit=${limit}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(limit);
        expect(response.body.total).toBeGreaterThanOrEqual(response.body.data.length * page);
    });

    test('should return a list of exercises filtered by name', async () => {
        const name = 'push'; // Assuming 'push' is part of exercise names
        const response = await request(app).get(`/exercises?name=${name}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.data.every(exercise => exercise.name.toLowerCase().includes(name))).toBe(true);
    });

    test('should return a list of exercises filtered by muscle group', async () => {
        const muscle = 'abdominals'; // Assuming 'abdominals' is a muscle group
        const response = await request(app).get(`/exercises?muscle=${muscle}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.data.some(exercise => exercise.primaryMuscles.includes(muscle) || exercise.secondaryMuscles.includes(muscle))).toBe(true);
    });

    test('should return a list of exercises filtered by category', async () => {
        const category = 'cardio'; // Assuming 'cardio' is a category
        const response = await request(app).get(`/exercises?category=${category}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.data.some(exercise => exercise.category.toLowerCase() === category.toLowerCase())).toBe(true);
    });

    test('should return a list of exercises filtered by force', async () => {
        const force = 'pull'; // Assuming 'pull' is a force type
        const response = await request(app).get(`/exercises?force=${force}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.data.every(exercise => exercise.force && exercise.force.toLowerCase() === force)).toBe(true);
    });

    test('should return a list of exercises filtered by level', async () => {
        const level = 'beginner'; // Assuming 'beginner' is a level
        const response = await request(app).get(`/exercises?level=${level}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.data.every(exercise => exercise.level.toLowerCase() === level)).toBe(true);
    });

    test('should return a list of exercises filtered by mechanic', async () => {
        const mechanic = 'compound'; // Assuming 'compound' is a mechanic
        const response = await request(app).get(`/exercises?mechanic=${mechanic}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.data.every(exercise => exercise.mechanic && exercise.mechanic.toLowerCase() === mechanic)).toBe(true);
    });

    test('should return a list of exercises filtered by equipment', async () => {
        const equipment = 'dumbbell'; // Assuming 'dumbbell' is an equipment type
        const response = await request(app).get(`/exercises?equipment=${equipment}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.data.every(exercise => exercise.equipment && exercise.equipment.toLowerCase() === equipment)).toBe(true);
    });

    test('should return a specific exercise by name', async () => {
        const exercisename = '3_4_Sit-Up';
        const response = await request(app).get(`/exercise/${exercisename}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(exercisename);
    });

    test('should return 404 for non-existent exercise name', async () => {
        const nonExistentExercisename = 'non_existent_exercise'; // Assuming this exercise name does not exist
        const response = await request(app).get(`/exercise/${nonExistentExercisename}`).auth('user1@email.com', 'password1');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Exercise not found');
    });
});
