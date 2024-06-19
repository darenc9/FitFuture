// src/app.js

const express = require('express');
const cors = require('cors');
const { version } = require('../package.json');
const passport = require('passport');
const authenticate = require('./auth');
const app = express();

// Allow all origins
app.use(cors());

// allow post requests to have the req.body parsed
app.use(express.json());

// Set up our passport authentication middleware
passport.use(authenticate.strategy());
app.use(passport.initialize());

app.use('/', require('./routes'));

// 404 error middleware
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found'});
});

// Generic error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});
  
module.exports = app;
