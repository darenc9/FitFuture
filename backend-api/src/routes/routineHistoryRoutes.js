// src/routes/routineHistoryRoutes.js

const express = require('express');
const router = express.Router();
const { getOrCreateRoutineHistoryByUserAndRoutine, updateRoutineHistory } = require('../services/routineHistory-service');

  //Get a routine history by id and user id
  module.exports.getByIds = async (req, res) => {
    const userId = req.params.userId;
    const routineId = req.params.routineId;

    if (!userId || !routineId) {
        console.log("missing user or routine");
      return res.status(400).json({ error: 'userId and routineId are required' });
    }
    console.log("in get by ids for routine history");

    let routineHistory = getOrCreateRoutineHistoryByUserAndRoutine(userId,routineId)
    .then(data => {
        console.log(data);
      res.status(200).json(data);
    }).catch(msg => {
      res.status(404).json({error: msg});
    })
  };

  module.exports.updateById = async (req, res) => {
    const id = req.params.id;
    const data = req.body; //array of completed exercises
    console.log(data);
    console.log(id);        

    if (!id ) {
        console.log("missing id");
      return res.status(400).json({ error: 'id is required' });
    }
    console.log("in update by id for routine history");

    let routineHistory = updateRoutineHistory(id,data)
    .then(data => {
        console.log(data);
        console.log("updated routine history in db");
      res.status(200).json(data);
    }).catch(msg => {
      res.status(404).json({error: msg});
    })
  };