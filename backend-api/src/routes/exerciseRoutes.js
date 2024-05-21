// src/routes/exerciseRoutes.js

const express = require('express');
const router = express.Router();
const exercisesData = require('../data/exercises.json');


// Route to get all exercises or filter by name or muscle group with pagination support
router.get('/exercises', (req, res) => {
    const { name, muscle, page = 1, limit = 10 } = req.query;
    
    let filteredExercises = exercisesData;

    // Filter by name if provided
    if (name) {
        filteredExercises = filteredExercises.filter(exercise =>
            exercise.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    // Filter by muscle group if provided
    if (muscle) {
        filteredExercises = filteredExercises.filter(exercise =>
            exercise.primaryMuscles.includes(muscle.toLowerCase()) ||
            exercise.secondaryMuscles.includes(muscle.toLowerCase())
        );
    }

    // Pagination
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    
    const paginatedExercises = filteredExercises.slice(startIndex, endIndex);

    if (paginatedExercises.length > 0) {
        res.status(200).json({
            data: paginatedExercises,
            total: filteredExercises.length,
        });
    } else {
        res.status(404).json({ message: 'Exercise not found' });
    }
});


// Route to get a specific exercise by name
router.get('/exercise/:exercisename', (req, res) => {
    const exerciseName = req.params.exercisename.toLowerCase();
    const exercise = exercisesData.find(ex => ex.name.toLowerCase() === exerciseName);

    if (exercise) {
        res.status(200).json(exercise);
    } else {
        res.status(404).json({ message: 'Exercise not found' });
    }
});

module.exports = router;
