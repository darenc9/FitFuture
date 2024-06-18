// src/routes/workoutRoutes.js

const express = require('express');
const router = express.Router();
const workoutService = require('../services/workout-service');
const workoutExerciseService = require('../services/workoutExercise-service');
const mongoose = require('mongoose');

//Get a list of all preset workouts
module.exports.getAll = async (req, res) => {
  const user = req.query.user;
    workoutService.getAllWorkouts(user)
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
  const data = req.body;
  console.log(data);

  // Destructure workout and exercises from the request body
  const { workout, exercises } = data;
  console.log(workout.workoutId);
  try {
    // Create the workout object (only data that can get changed is public and name)
    const workoutData = {
      public: workout.public, 
      name: workout.name,
    };

    const updatedWorkout = await workoutService.updateWorkout(workout.workoutId, workoutData);

    // Initialize an array to hold the updated workout exercises
    const updatedExercises = [];

    //Note: an exercise that already exits will look like
    // {
    //   id: '90_90_Hamstring',
    //   workoutExerciseId: '666a50ab604f9051ca16d6fa',
    //   name: '90/90 Hamstring',
    //   sets: 3,
    //   reps: 3,
    //   notes: '',
    //   weight: null
    // },

    //a newly added exercise will need a generated id and will be:
    // {
    //   name: '3/4 Sit-Up',
    //   sets: '4',
    //   reps: '4',
    //   notes: '',
    //   workoutId: '666a50ab604f9051ca16d6f7',
    //   id: '3_4_Sit-Up'
    // }

    //handle deleting of exercises first
    const existingExercises = await workoutExerciseService.getWorkoutExerciseByWorkoutId(workout.workoutId);
    const existingExerciseIds = existingExercises.map(ex => ex.workoutExerciseId.toString());
    console.log('current exercise workout ids: ',existingExerciseIds);

    const requestExerciseIds = exercises
    .filter(ex => ex.hasOwnProperty('workoutExerciseId'))
    .map(ex => ex.workoutExerciseId.toString());
    console.log('request workout exercises: ',requestExerciseIds);

    // Get the list of workout exercise IDs that are not in the request exercises
    const idsNotInExercises = existingExerciseIds.filter(id => !requestExerciseIds.includes(id));
    console.log('IDs not in exercises:', idsNotInExercises);


    // Delete the workout exercises that are not in the request exercises
    if (idsNotInExercises.length > 0) {
      for (const id of idsNotInExercises) {
        await workoutExerciseService.deleteWorkoutExercise(id);
        console.log(`Deleted workout exercise with ID: ${id}`);
      }
    }

    // Create and save each workout exercise
    for (const exercise of exercises) {
      console.log("in for loop");
      var workoutExerciseId;
      var create = false;
      //if already has workout exercise id, dont need to gerneate new id
      if (exercise.workoutExerciseId){
        workoutExerciseId = exercise.workoutExerciseId
      } else {
        workoutExerciseId = new mongoose.Types.ObjectId();
        create = true;
      }

      const workoutExerciseData = {
        workoutExerciseId: workoutExerciseId,
        workoutId: updatedWorkout.workoutId, // Link to the created workout
        exerciseId: exercise.id,
        name: exercise.name,
        sets: parseInt(exercise.sets, 10) || null, // Convert sets to integer
        reps: parseInt(exercise.reps, 10) || null, // Convert reps to integer
        duration: exercise.duration || null, // Default to 0 if not provided
        weight: null, // Default to 0 if not provided
        notes: exercise.notes
      };

      //if need to create the new workout exercise
      if (create){
        const createdExercise = await workoutExerciseService.createWorkoutExercise(workoutExerciseData);
        updatedExercises.push(createdExercise);
        console.log("created exercise");
      } else {
        const updatedExercise = await workoutExerciseService.updateWorkoutExercise(workoutExerciseId, workoutExerciseData);
        updatedExercises.push(updatedExercise);
        console.log("updated exercise");
      }  

    }



    res.status(200).json({
      message: "Workout updated successfully",
      workout: updatedWorkout,
      exercises: updatedExercises
    });
  }  catch (error) {
    console.error('Error creating workout:', error);
      res.status(500).json({ message: 'Error Updating workout', error: error.message });
  }


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

