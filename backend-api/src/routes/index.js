// src/routes/index.js

const express = require('express');
const { hostname } = require('os');
const { version, author } = require('../../package.json');

const router = express.Router();
// Import other route files
const exerciseRoutes = require('./exerciseRoutes');
const profileRoutes = require('./profileRoutes');
const historyRoutes = require('./historyRoutes');
const testDbRoutes = require('./testDbRoute');

//get the workout functions
const { getAll, getById, getWorkoutById, createWorkout, updateWorkout} = require('./workoutRoutes');

// Health Check
router.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json({
      status: 'ok',
      author,
      githubUrl: 'https://github.com/darenc9/FitFuture',
      version,
    });
  });


// Mount the routes
router.use(exerciseRoutes);
router.use(profileRoutes);
router.use(historyRoutes);
// TODO: Mount additional routes for other features as needed
router.use(testDbRoutes);

// Define first route: GET /v1/fragments
router.get('/workouts', getAll);

//get the workout information by workout id
router.get('/workouts/:id', getWorkoutById);

//get the workout exercises for a workout
router.get('/workout/:id', getById);

router.post('/workout', createWorkout);

router.put('/workout', updateWorkout);
module.exports = router;