// src/services/profile-service.js

const Profile = require("../schemas/Profile");
const { connectToDb } = require("./connectToDB");

// Ensure connection to the database exists
const ensureConnection = async () => {
  if (!Profile) {
    await connectToDb();
  }
};

// get all existing profiles
module.exports.getAllProfiles = async function () {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    Profile.find().exec()
      .then((profiles) => {
        if (profiles.length > 0) {
          resolve(profiles);
        } else {
          reject("No profile records found");
        }
      }).catch((err) => {
        reject("Error retrieving profile records: ", err);
      });
  });
};

// get profile for a specific user by id
module.exports.getProfileById = async function (id) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    Profile.findOne({ userId: id }).exec()
      .then((profile) => {
        if (profile) {
          resolve(profile);
        } else {
          reject("No profile record found with the userId: " + id);
        }
      }).catch((err) => {
        reject("Error retrieving profile record: ", err);
      });
  });
};

// create new profile
module.exports.createProfile = async function (profileData) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    const newProfile = new Profile(profileData);
    newProfile.save()
    .then((savedProfile) => {
      resolve(savedProfile);
    }).catch((err) => {
      reject("Error creating profile record: ", err);
    });
  });
};

// delete profile by id
module.exports.deleteProfile = async function (id) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    Profile.findByIdAndDelete(id).exec()
      .then((deletedProfile) => {
        resolve("Profile deleted: " + deletedProfile);
      }).catch((err) => {
        reject("Error deleting profile: ", err);
      })
  });
};

// TODO: make an update profile function

// TODO: make add / remove favourites functions
