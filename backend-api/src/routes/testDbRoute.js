// src/routes/testDbRoute.js

const express = require('express');
const router = express.Router();
const testService = require('../services/test-service');

router.get('/tests', (req, res) => {
    testService.getTests()
    .then(data => {
      res.json(data);
    }).catch(msg => {
      res.status(404).json({error: msg});
    })
});

module.exports = router;
