// tests/unit/exerciseRoutes.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('Exercise Routes', () => {
    test('should return a list of exercises', async () => {
        const response = await request(app).get('/exercises');

        expect(response.status).toBe(200);
    });
});