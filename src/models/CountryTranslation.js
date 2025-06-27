const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CountryTranslation extends Model {}

CountryTranslation.init({
  id: {
    type: DataTypes.BIGINT, // PostgreSQL BIGSERIAL
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  country_id: {
    type: DataTypes.BIGINT, // PostgreSQL BIGINT
    allowNull: true  // Notice: in your SQL insert you had `NULL`, so should be nullable
  },
  locale: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(191),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'CountryTranslation',
  tableName: 'country_translations',
  timestamps: false, // because no created_at/updated_at in table
  underscored: true,
  freezeTableName: true
});

// Optional — if you plan to load related Country model
// Define relationship only if you have Country model already defined:
CountryTranslation.associate = (models) => {
  CountryTranslation.belongsTo(models.Country, {
    foreignKey: 'country_id',
    as: 'country'
  });
};

module.exports = CountryTranslation;
