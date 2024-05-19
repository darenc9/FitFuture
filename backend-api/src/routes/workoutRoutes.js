// src/routes/workoutRoutes.js

const express = require('express');
const router = express.Router();
const workoutService = require('../services/workout-service');

//Get a list of all preset workouts
module.exports.getAll = async (req, res) => {
    workoutService.getAllWorkouts()
    .then(data => {
      res.status(200).json(data);
    }).catch(msg => {
      res.status(404).json({error: msg});
    })
  };

