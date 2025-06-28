const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class RegionTranslation extends Model {}

RegionTranslation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: true,  // ✅ corrected to match PostgreSQL DEFAULT NULL
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RegionTranslation',
    tableName: 'region_translations',
    timestamps: false,
    freezeTableName: true, // prevent Sequelize from pluralizing table name
  }
);

module.exports = RegionTranslation;
