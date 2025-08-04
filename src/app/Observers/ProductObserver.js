'use strict';

const { v4: uuidv4 } = require('uuid');
const cache = require('node-cache-instance'); // Replace with your cache handler
const Product = require('../../models/Product'); // Adjust path as per your structure
const ModelLogService = require('../../services/ModelLogService/ModelLogService');
const { loggable } = require('../../traits/Loggable'); // assuming it's a middleware/utility trait

// Handle the "creating" event
async function onCreating(product) {
  product.uuid = uuidv4();

  await ModelLogService.logging(product, product.toObject(), 'creating');
}

// Handle the "created" event
async function onCreated() {
  const s = await cache.get('rjkcvd.ewoidfh');

  await cache.flushAll();

  try {
    await cache.set('rjkcvd.ewoidfh', s);
  } catch (error) {
    // silently handle
  }
}

// Handle the "updated" event
async function onUpdated(product) {
  const s = await cache.get('rjkcvd.ewoidfh');

  await cache.flushAll();

  try {
    await cache.set('rjkcvd.ewoidfh', s);
  } catch (error) {
    // silently handle
  }

  await ModelLogService.logging(product, product.toObject(), 'updated');
}

// Handle the "deleted" event
async function onDeleted(product) {
  const s = await cache.get('rjkcvd.ewoidfh');

  await cache.flushAll();

  try {
    await cache.set('rjkcvd.ewoidfh', s);
  } catch (error) {
    // silently handle
  }

  await ModelLogService.logging(product, product.toObject(), 'deleted');
}

// Handle the "restored" event
async function onRestored(product) {
  await ModelLogService.logging(product, product.toObject(), 'restored');
}

// Export all handlers
module.exports = {
  onCreating,
  onCreated,
  onUpdated,
  onDeleted,
  onRestored,
};
