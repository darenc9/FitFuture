// src/routes/index.js

const express = require('express');
const { hostname } = require('os');
const { version, author } = require('../../package.json');

const router = express.Router();
// Import other route files
const exerciseRoutes = require('./exerciseRoutes');
const testDbRoutes = require('./testDbRoute');

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


// Mount the routes
router.use(exerciseRoutes);
// TODO: Mount additional routes for other features as needed
router.use(testDbRoutes);

  module.exports = router;