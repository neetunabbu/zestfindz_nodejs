const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class TermConditionTranslation extends Model {}

TermConditionTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  term_condition_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT, // Correct type matching PostgreSQL TEXT
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'TermConditionTranslation',
  tableName: 'term_condition_translations',
  timestamps: true,             // Enable automatic timestamps
  createdAt: 'created_at',      // Map createdAt column
  updatedAt: 'updated_at',      // Map updatedAt column
  underscored: true
});

module.exports = TermConditionTranslation;
