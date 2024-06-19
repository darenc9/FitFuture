// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

// Tests accessing a nonexistent route
describe('404 Handler', () => {
    test('should return a 404 status and error message', async () => {
      const response = await request(app).get('/nonexistent-route').auth('user1@email.com', 'password1');
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "Resource not found",
      });
    });
  });

// Tests Health Check
describe('Health Check', () => {
    test('Health check returns healthy', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
    });
});