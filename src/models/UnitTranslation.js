// models/UnitTranslation.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Make sure the path is correct based on your project structure

const UnitTranslation = sequelize.define('UnitTranslation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  unit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'unit_translations',
  timestamps: false,
});

module.exports = { UnitTranslation };
