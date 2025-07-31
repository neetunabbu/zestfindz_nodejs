// src/app/Observers/CategoryObserver.js

const { v4: uuidv4 } = require('uuid');
const { Category } = require('../../models/Category'); // adjust if needed
const ModelLogService = require('../../services/ModelLogService/ModelLogService');

// "creating" event - before save
async function creating(category) {
  category.uuid = uuidv4();
}

// "created" event - after save
async function created(category) {
  await ModelLogService.logging(category, category.dataValues, 'created');
}

// "updated" event
async function updated(category) {
  await ModelLogService.logging(category, category.dataValues, 'updated');
}

// "deleted" event
async function deleted(category) {
  await ModelLogService.logging(category, category.dataValues, 'deleted');
}

// "restored" event
async function restored(category) {
  await ModelLogService.logging(category, category.dataValues, 'restored');
}

module.exports = {
  creating,
  created,
  updated,
  deleted,
  restored,
};
