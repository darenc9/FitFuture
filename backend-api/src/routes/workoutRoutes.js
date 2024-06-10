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

module.exports.getWorkoutById = async (req, res) => {
  const id = req.params.id;
  workoutService.getWorkoutById(id)
  .then(data => {
    res.status(200).json(data);
  }).catch(msg => {
    res.status(404).json({error: msg});
  })
};

module.exports.createWorkout = async (req, res) => {
  
  //create the workout object
  const data = req.body;
  console.log(data);

  // {
  //   workout: {
  //     name: 'workout name',
  //     exerciseIds: [ '3_4_Sit-Up', '90_90_Hamstring' ]
  //   },
  //   exercises: [
  //     { name: '3/4 Sit-Up', sets: 0, reps: 0, notes: '' },
  //     { name: '90/90 Hamstring', sets: 0, reps: 0, notes: '' }
  //   ]
  // }
  res.status(200).json("ok");
  //for each object in the recieved json array
  //create a workout exercise object (ensure same workout id)

  
};

