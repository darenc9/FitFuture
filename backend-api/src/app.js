// src/app.js

const express = require('express');
const cors = require('cors');
const { version } = require('../package.json');

const app = express();
  
// Replace with your frontend URL
const allowedOrigins = ['https://fit-future-emvfzk8cx-devons-projects-9e2ee303.vercel.app/'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow cookies and other credentials
};

// allow post requests to have the req.body parsed
app.use(express.json());

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
