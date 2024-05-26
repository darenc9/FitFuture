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

// get a specific profile by a user's id
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
    .then((createdProfile) => {
      res.status(201).json(createdProfile);
    }).catch((err) => {
      res.status(422).json({error: err});
    });
});

// update an existing profile
router.put('/profile/:profileId', (req, res) => {
  profileService.updateProfileById(req.params.profileId, req.body)
    .then((updatedProfile) => {
      res.status(200).json(updatedProfile);
    }).catch((err) => {
      res.status(422).json({error: err});
    });
});

// delete a profile
router.delete('/profile/:profileId', (req, res) => {
  profileService.deleteProfile(req.params.profileId)
    .then((deletedProfile) => {
      res.status(201).json(deletedProfile);
    }).catch((err) => {
      res.status(422).json({error: err});
    });
});

module.exports = router;
