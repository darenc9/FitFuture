// src/routes/workoutRoutes.js

const express = require('express');
const router = express.Router();
const workoutService = require('../services/workout-service');
const workoutExerciseService = require('../services/workoutExercise-service');
const mongoose = require('mongoose');

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

module.exports.updateWorkout = async (req, res) => {
  console.log(req.body);
  res.status(200).json("OK");
};

module.exports.createWorkout = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    // Destructure workout and exercises from the request body
    const { workout, exercises } = data;

    // Create the workout object
    const workoutData = {
      workoutId: new mongoose.Types.ObjectId(), // Generate a new ObjectId for workoutId
      userId: workout.user || null, // Set to userId if provided
      routineId: null, // Assuming no routine association for now, set if needed
      public: workout.public, // Use provided public value
      name: workout.name,
      category: "Custom"
    };

    const createdWorkout = await workoutService.createWorkout(workoutData);

        // Initialize an array to hold the created workout exercises
        const createdExercises = [];

        // Create and save each workout exercise
        for (const exercise of exercises) {
          const workoutExerciseData = {
            workoutExerciseId: new mongoose.Types.ObjectId(), // Generate a new ObjectId for workoutExerciseId
            workoutId: createdWorkout.workoutId, // Link to the created workout
            exerciseId: exercise.id,
            name: exercise.name,
            sets: parseInt(exercise.sets, 10) || null, // Convert sets to integer
            reps: parseInt(exercise.reps, 10) || null, // Convert reps to integer
            duration: exercise.duration || null, // Default to 0 if not provided
            weight: null, // Default to 0 if not provided
            notes: exercise.notes
          };
          
          const createdExercise = await workoutExerciseService.createWorkoutExercise(workoutExerciseData);
          createdExercises.push(createdExercise);
        }

      console.log("before sending response");
    // Respond with success message
    res.status(200).json({
      message: "Workout and exercises created successfully",
      workout: createdWorkout,
      exercises: createdExercises
    });
  } catch (error) {
    console.error('Error creating workout:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error creating workout', error: error.message });
    }
  }
};

