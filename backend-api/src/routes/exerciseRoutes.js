// src/routes/exerciseRoutes.js

const express = require('express');
const router = express.Router();
const exercisesData = require('../data/exercises.json');


router.get('/exercises', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(exercisesData);
});


module.exports = router;
