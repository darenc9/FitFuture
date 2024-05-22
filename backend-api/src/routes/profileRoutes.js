// src/routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const profileService = require('../services/profile-service');

// get all profiles (for admins to test db)
router.get('/profiles', (req, res) => {
  profileService.getAllProfiles()
    .then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      res.status(404).json({error: err});
    });
});

// get a specific profile by id
router.get('/profile/:profileId', (req, res) => {
  profileService.getProfileById(req.params.profileId)
    .then((data) => {
      res.status(200).json(data);
    }).catch((err) => {
      res.status(404).json({error: err});
    });
});

// make a new profile
router.post('/profile/create', (req, res) => {
  profileService.createProfile(req.body)
    .then((data) => {
      res.status(201).json({"created profile": data});
    }).catch((err) => {
      res.status(422).json({error: err});
    });
});

// delete a profile
router.delete('/profile/:profileId', (req, res) => {
  profileService.deleteProfile(req.params.profileId)
    .then((data) => {
      res.status(201).json({"deleted profile": data});
    }).catch((err) => {
      res.status(422).json({error: err});
    });
});

module.exports = router;
