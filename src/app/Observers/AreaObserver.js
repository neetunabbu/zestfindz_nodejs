// src/app/Observers/AreaObserver.js

const { RegionRelationsObserver } = require('../Observers/RegionRelationsObserver');
const Area = require('../../models/Area');

/**
 * Handle the Area "updated" event.
 *
 * @param {Object} model - Area model instance
 * @returns {void}
 */
const updated = async (model) => {
  try {
    await RegionRelationsObserver.area(model);
  } catch (error) {
    console.error('Error in AreaObserver.updated:', error);
  }
};

module.exports = {
  updated,
};
