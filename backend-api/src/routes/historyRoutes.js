// src/routes/historyRoutes.js

const express = require('express');
const router = express.Router();
const historyService = require('../services/history-service');

// get all history for a specific user by userId
router.get('/histories/:userId', (req, res) => {
  historyService.getHistoryByUserId(req.params.userId)
    .then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      res.status(404).json({error: err});
    });
});

// get all history for a specific user by userId for progress
router.get('/history/:userId/progress', (req, res) => {
  historyService.getMostCommonExercises(req.params.userId)
    .then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      res.status(404).json({error: err});
    });
});

// get a specific history entry by id
router.get('/history/:historyId', (req, res) => {
  historyService.getHistoryById(req.params.historyId)
    .then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      res.status(404).json({error: err});
    });
});

// make a new history entry
router.post('/history', (req, res) => {
  historyService.createHistory(req.body)
    .then((createdHistory) => {
      res.status(201).json(createdHistory);
    }).catch((err) => {
      res.status(422).json({error: err});
    });
});

// update an existing history entry by id
router.put('/history/:historyId', (req, res) => {
  historyService.updateHistoryById(req.params.historyId, req.body)
    .then((updatedHistory) => {
      res.status(200).json(updatedHistory);
    }).catch((err) => {
      res.status(422).json({error: err});
    });
});

// delete a history entry
router.delete('/history/:historyId', (req, res) => {
  historyService.deleteHistory(req.params.historyId)
    .then((deletedHistory) => {
      res.status(201).json(deletedHistory);
    }).catch((err) => {
      res.status(422).json({error: err});
    });
});

module.exports = router;
