const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CityTranslation extends Model {}

CityTranslation.init(
  {
    id: {
      type: DataTypes.BIGINT, // BIGSERIAL equivalent
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true,  // ✅ matches your SQL (no NOT NULL in SQL)
    },
    locale: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CityTranslation',
    tableName: 'city_translations',
    timestamps: false,
  }
);

// No need to initialize via static init()

module.exports = CityTranslation;
