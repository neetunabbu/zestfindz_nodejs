const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL DB connection

// Define the Region model matching PostgreSQL 'regions' table
const Region = sequelize.define('Region', {
  id: {
    type: DataTypes.BIGINT,        // PostgreSQL BIGSERIAL → Sequelize BIGINT
    primaryKey: true,
    autoIncrement: true,
  },
  active: {
    type: DataTypes.BOOLEAN,       // PostgreSQL BOOLEAN
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'regions',
  timestamps: false,
});

// Define model relationships here via associate function
Region.associate = (models) => {
  Region.hasMany(models.RegionTranslation, { as: 'translations', foreignKey: 'region_id' });
  Region.hasOne(models.RegionTranslation, { as: 'translation', foreignKey: 'region_id' });

  Region.hasOne(models.Country, { as: 'country', foreignKey: 'region_id' });
  Region.hasMany(models.Country, { as: 'countries', foreignKey: 'region_id' });

  Region.hasOne(models.City, { as: 'city', foreignKey: 'region_id' });
  Region.hasMany(models.City, { as: 'cities', foreignKey: 'region_id' });

  Region.hasOne(models.Area, { as: 'area', foreignKey: 'region_id' });
  Region.hasMany(models.Area, { as: 'areas', foreignKey: 'region_id' });

  Region.hasOne(models.DeliveryPrice, { as: 'deliveryPrice', foreignKey: 'region_id' });
  Region.hasMany(models.DeliveryPrice, { as: 'deliveryPrices', foreignKey: 'region_id' });
};

module.exports = Region;
