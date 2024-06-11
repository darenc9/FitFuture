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
      category: workout.category || ''
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
            sets: parseInt(exercise.sets, 10), // Convert sets to integer
            reps: parseInt(exercise.reps, 10), // Convert reps to integer
            duration: exercise.duration || 0, // Default to 0 if not provided
            weight: exercise.weight || 0, // Default to 0 if not provided
            notes: exercise.notes || ''
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


//   {
//     workout: {
//       name: 'workout name',
//       exerciseIds: [ '3_4_Sit-Up', '90_90_Hamstring' ],     
//       public: true,
//       user: '66575f452e46d5e14258c321'
//     },
//     exercises: [
//       {
//           name: '3/4 Sit-Up',
//           sets: '2',
//           reps: '2',
//           notes: '',
//           id: '3_4_Sit-Up'
//       },
//       {
//           name: '90/90 Hamstring',
//           sets: '2',
//           reps: '2',
//           notes: '',
//           id: '90_90_Hamstring'
//       }
//     ]
// }
};

