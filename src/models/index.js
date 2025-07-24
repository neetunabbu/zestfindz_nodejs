// src/models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/db');
const db = {};

const sequelize = config;

fs.readdirSync(__dirname)
  .filter(file =>
    file !== basename &&
    file.endsWith('.js') &&
    !file.startsWith('.')
  )
  .forEach(file => {
    try {
      const modelFile = require(path.join(__dirname, file));
      if (typeof modelFile === 'function') {
        const model = modelFile(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      } else {
        console.warn(`⚠️  Skipped loading model "${file}" - not a function`);
      }
    } catch (err) {
      // console.error(`❌ Failed to load model "${file}":`, err.message);
    }
  });


// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// console.log('Loaded models:', Object.keys(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
