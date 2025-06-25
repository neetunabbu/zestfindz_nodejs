const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db'); // ✅ Database connection

const db = {};

// ✅ Dynamically import all models in the models folder
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.js') && file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

// ✅ Setup associations if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Add Sequelize and connection to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ✅ Show loaded models (optional - remove in production if needed)

// console.log('✅ Models Loaded:', Object.keys(db));

module.exports = db;
