// src/routes/index.js

const express = require('express');
const { hostname } = require('os');
const { version, author } = require('../../package.json');

const router = express.Router();

// Health Check
router.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json({
      status: 'ok',
      author,
      githubUrl: 'https://github.com/darenc9/FitFuture',
      version,
    });
  });


  module.exports = router;