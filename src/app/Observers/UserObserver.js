// File: src/app/Observers/UserObserver.js

const { v4: uuidv4 } = require('uuid');
const { randomBytes } = require('crypto');
const { User } = require('../../models/User');
const { Point } = require('../../models/Point');
const ModelLogService = require('../../services/ModelLogService/ModelLogService');

// Utility to mimic Laravel's Str::random and Str::limit
const strRandom = (length) => randomBytes(length).toString('hex').slice(0, length);
const strLimit = (str, limit) => str.slice(0, limit);
const strLength = (str) => str.length;

// Handle the User "creating" event
const creating = async (user) => {
  let myReferral = strRandom(2) + user.id + strRandom(2);

  if (strLength(myReferral) > 8) {
    myReferral = strLimit(myReferral, 8);
  } else if (strLength(myReferral) < 8) {
    myReferral += strRandom(8 - strLength(myReferral));
  }

  user.uuid = uuidv4();
  user.my_referral = myReferral.toUpperCase();
};

// Handle the User "created" event
const created = async (user) => {
  await Point.create({ userId: user.id });

  const logger = new ModelLogService();
  await logger.logging(user, user.toJSON(), 'created');
};

// Handle the User "updated" event
const updated = async (user) => {
  const logger = new ModelLogService();
  await logger.logging(user, user.toJSON(), 'updated');
};

// Handle the User "deleted" event
const deleted = async (user) => {
  const logger = new ModelLogService();
  await logger.logging(user, user.toJSON(), 'deleted');
};

// Handle the User "restored" event
const restored = async (user) => {
  const logger = new ModelLogService();
  await logger.logging(user, user.toJSON(), 'restored');
};

module.exports = {
  creating,
  created,
  updated,
  deleted,
  restored,
};
