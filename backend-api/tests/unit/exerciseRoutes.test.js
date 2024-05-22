// tests/unit/exerciseRoutes.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('Exercise Routes', () => {
    test('should return a list of exercises with default pagination', async () => {
        const response = await request(app).get('/exercises');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(10); // Assuming default limit is 10
        expect(response.body.total).toBeGreaterThanOrEqual(response.body.data.length);
    });

    test('should return a list of exercises with custom pagination', async () => {
        const page = 2;
        const limit = 5;
        const response = await request(app).get(`/exercises?page=${page}&limit=${limit}`);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(limit);
        expect(response.body.total).toBeGreaterThanOrEqual(response.body.data.length * page);
    });

    test('should return a list of exercises filtered by name', async () => {
        const name = 'push'; // Assuming 'push' is part of exercise names
        const response = await request(app).get(`/exercises?name=${name}`);

        expect(response.status).toBe(200);
        expect(response.body.data.every(exercise => exercise.name.toLowerCase().includes(name))).toBe(true);
    });

    test('should return a list of exercises filtered by muscle group', async () => {
        const muscle = 'abdominals'; // Assuming 'abdominals' is a muscle group
        const response = await request(app).get(`/exercises?muscle=${muscle}`);

        expect(response.status).toBe(200);
        expect(response.body.data.some(exercise => exercise.primaryMuscles.includes(muscle) || exercise.secondaryMuscles.includes(muscle))).toBe(true);
    });

    test('should return a list of exercises filtered by category', async () => {
        const category = 'cardio'; // Assuming 'cardio' is a category
        const response = await request(app).get(`/exercises?category=${category}`);

        expect(response.status).toBe(200);
        expect(response.body.data.some(exercise => exercise.category.toLowerCase() === category.toLowerCase())).toBe(true);
    });

    test('should return a specific exercise by name', async () => {
        const exercisename = '3_4_Sit-Up';
        const response = await request(app).get(`/exercise/${exercisename}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(exercisename);
    });

    test('should return 404 for non-existent exercise name', async () => {
        const nonExistentExercisename = 'non_existent_exercise'; // Assuming this exercise name does not exist
        const response = await request(app).get(`/exercise/${nonExistentExercisename}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Exercise not found');
    });
});
