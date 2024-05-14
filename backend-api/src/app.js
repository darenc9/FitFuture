// src/app.js

const express = require('express');
const cors = require('cors');
const { version } = require('../package.json');
const app = express();
app.use(cors());

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