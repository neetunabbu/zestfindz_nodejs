const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CategoryTranslation extends Model {}

// Define model fields
CategoryTranslation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    category_id: {
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
    },
    description: {
      type: DataTypes.TEXT,   // ✅ Corrected type from STRING to TEXT
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'CategoryTranslation',
    tableName: 'category_translations',
    timestamps: false,
  }
);

module.exports = CategoryTranslation;
