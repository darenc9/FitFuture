// src/routes/workoutRoutes.js

const express = require('express');
const router = express.Router();
const workoutService = require('../services/workout-service');
const workoutExerciseService = require('../services/workoutExercise-service');

//Get a list of all preset workouts
module.exports.getAll = async (req, res) => {
    workoutService.getAllWorkouts()
    .then(data => {
      res.status(200).json(data);
    }).catch(msg => {
      res.status(404).json({error: msg});
    })
  };

  //Get a list of all workout exercises for specific workout (ie get workout by id)
module.exports.getById = async (req, res) => {
  const id = req.params.id;
  workoutExerciseService.getWorkoutExerciseByWorkoutId(id)
  .then(data => {
    res.status(200).json(data);
  }).catch(msg => {
    res.status(404).json({error: msg});
  })
};


