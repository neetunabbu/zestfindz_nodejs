const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class PropertyGroupTranslation extends Model {}

PropertyGroupTranslation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    property_group_id: { // ✅ corrected from extra_group_id
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'PropertyGroupTranslation',
    tableName: 'property_group_translations', // ✅ add tableName to be explicit
    timestamps: false,
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
    underscored: true, // Because your table uses snake_case column names
  }
);

module.exports = PropertyGroupTranslation;
