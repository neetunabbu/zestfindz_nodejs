const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class TagTranslation extends Model {}

TagTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(191),  // Matches VARCHAR(191)
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,          // Correctly matches TEXT in DB
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'TagTranslation',
  tableName: 'tag_translations',
  timestamps: false,
  underscored: true
});

module.exports = TagTranslation;
