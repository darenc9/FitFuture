// src/routes/workoutExerciseRoutes.js

const express = require('express');
const router = express.Router();
const workoutExerciseService = require('../services/workoutExercise-service');

// get a specific workoutExercise by id
router.get('/we/:workoutExerciseId', (req, res) => {
  workoutExerciseService.getWorkoutExerciseById(req.params.workoutExerciseId)
    .then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      res.status(404).json({error: err});
    });
});

module.exports = router;
