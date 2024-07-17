// src/routes/routineRoutes.js

const express = require('express');
const router = express.Router();
const { getRoutineById, getAllRoutines, createRoutine, updateRoutine, deleteRoutine } = require('../../src/services/routine-service');
const Routine = require('../../src/schemas/Routine');


// Route to get all routines (preset, public and user)
router.get('/routines', async (req, res) => {
    try {
        const user = req.query.user;
        
        console.log("/routines user: ", user);
        const routines = await getAllRoutines(user);
        res.status(200).json(routines);
    } catch (error) {
        res.status(500).json({error: error});
    }
});


// Route to get a specific routine by id
router.get('/routine/:routineid', async (req, res) => {
    try {
        const routineId = req.params.routineid;
        const routine = await getRoutineById(routineId);
        res.status(200).json(routine);
      } catch (error) {
        console.log("Error GET: routine/:routineid ", error);
        res.status(500).json({ error: error });
      }
});

// Route to create a new routine
router.post('/routines', async (req, res) => {
  console.log("inside post /routines");
    try {
      const routineData = req.body;
      console.log("routineData: ", routineData);
      const newRoutine = await createRoutine(routineData);
      res.status(201).json(newRoutine);
    } catch (error) {
      console.log("Error posting routine: ", error);
      res.status(500).json({ error: error.message });
    }
  });

// Route to update an existing routine
router.put('/routines/:routineid', async (req, res) => {
    try {
      const routineId = req.params.routineid;
      const updateData = req.body;
      const updatedRoutine = await updateRoutine(routineId, updateData);
      res.status(200).json(updatedRoutine);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Route to delete an existing routine
router.delete('/routines/:routineid', async (req, res) => {
    try {
        const routineId = req.params.routineid;
        await deleteRoutine(routineId);
        res.status(200).json({ message: 'Routine deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
