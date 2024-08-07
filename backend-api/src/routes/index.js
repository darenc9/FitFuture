// src/routes/index.js

const express = require('express');
const { hostname } = require('os');
const { version, author } = require('../../package.json');
const { authenticate } = require('../auth');

const router = express.Router();
// Import other route files
const exerciseRoutes = require('./exerciseRoutes');
const profileRoutes = require('./profileRoutes');
const historyRoutes = require('./historyRoutes');
const workoutExerciseRoutes = require('./workoutExerciseRoutes');
const testDbRoutes = require('./testDbRoute');
const routineRoutes = require('./routineRoutes');
//get the workout functions
const { getAll, getById, getWorkoutById, createWorkout, updateWorkout, createHistory, getRecentHistory } = require('./workoutRoutes');
//get routineHistoryRoutes
const { getByIds, updateById } = require('./routineHistoryRoutes');

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
router.use('', authenticate(), exerciseRoutes);
router.use(profileRoutes);
router.use(routineRoutes);
router.use(historyRoutes);
router.use(workoutExerciseRoutes);
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

router.post('/workout/finish', createHistory);

router.get('/workout/history/recent', getRecentHistory);

router.get('/routine/start/:userId/:routineId', getByIds); //pass route params: userid &routineId

router.put('/routine/start/:id', updateById); //pass route param routineHistoryId, quewry param workoutId

module.exports = router;