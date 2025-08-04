// src/app/Observers/BrandObserver.js

const { v4: uuidv4 } = require('uuid');
const ModelLogService = require('../../services/ModelLogService/ModelLogService');
const Brand = require('../../models/Brand');

// Handle the Brand "creating" event
const creating = async (brand) => {
  brand.uuid = uuidv4();
};

// Handle the Brand "created" event
const created = async (brand) => {
  const modelLogService = new ModelLogService();
  await modelLogService.logging(brand, brand, 'created');
};

// Handle the Brand "updated" event
const updated = async (brand) => {
  const modelLogService = new ModelLogService();
  await modelLogService.logging(brand, brand, 'updated');
};

// Handle the Brand "deleted" event
const deleted = async (brand) => {
  const modelLogService = new ModelLogService();
  await modelLogService.logging(brand, brand, 'deleted');
};

// Handle the Brand "restored" event
const restored = async (brand) => {
  const modelLogService = new ModelLogService();
  await modelLogService.logging(brand, brand, 'restored');
};

module.exports = {
  creating,
  created,
  updated,
  deleted,
  restored,
};
