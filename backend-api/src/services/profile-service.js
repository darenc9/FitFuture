// src/services/profile-service.js

const { default: mongoose } = require("mongoose");
const Profile = require("../schemas/Profile");
const { connectToDb } = require("./connectToDB");

let ProfileModel = mongoose.model('Profile', Profile.schema);

// Ensure connection to the database exists
const ensureConnection = async () => {
  if (!ProfileModel) {
    await connectToDb();
    ProfileModel = mongoose.model('Profile', Profile.schema);
  }
};

// get all existing profiles
module.exports.getAllProfiles = async function () {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    ProfileModel.find().exec()
      .then((profiles) => {
        if (profiles.length > 0) {
          resolve(profiles);
        } else {
          reject("No profile records found");
        }
      }).catch((err) => {
        reject("Error retrieving profile records: " + err );
      });
  });
};

// get a specific profile by id
module.exports.getProfileById = async function (id) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    ProfileModel.findOne({ _id: id }).exec()
      .then((profile) => {
        if (profile) {
          resolve(profile);
        } else {
          reject("No profile record found");
        }
      }).catch((err) => {
        reject("Error retrieving profile record: " + err );
      });
  });
};

// get profile for a specific user by id
module.exports.getProfileByUserId = async function (id) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    ProfileModel.findOne({ userId: id }).exec()
      .then((profile) => {
        if (profile) {
          resolve(profile);
        } else {
          reject("No profile record found with the userId: " + id);
        }
      }).catch((err) => {
        reject("Error retrieving profile record: " + err);
      });
  });
};

// create new profile
module.exports.createProfile = async function (profileData) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    const newProfile = new ProfileModel(profileData);
    newProfile.save()
    .then((savedProfile) => {
      resolve(savedProfile);
    }).catch((err) => {
      reject("Error creating profile record: " + err);
    });
  });
};

// delete profile by id
module.exports.deleteProfile = async function (id) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    ProfileModel.findByIdAndDelete(id).exec()
      .then((deletedProfile) => {
        resolve("Profile deleted: " + deletedProfile);
      }).catch((err) => {
        reject("Error deleting profile: " + err);
      })
  });
};

// update profile by id
module.exports.updateProfileById = async function (id, newData) {
  await ensureConnection();
  return new Promise((resolve, reject) => {
    ProfileModel.findByIdAndUpdate(id, newData, {new: true}).exec()
      .then((profile) => {
        if (profile) {
          resolve(profile);
        } else {
          reject("No profile record found");
        }
      }).catch((err) => {
        reject("Error updating profile record: " + err );
      });
  })
};

// TODO: make add / remove favourites functions
