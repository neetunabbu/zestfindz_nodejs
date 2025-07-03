const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db');
const WarehouseTranslation = require('./WarehouseTranslation');
const WarehouseWorkingDay = require('./WarehouseWorkingDay');
const WarehouseClosedDate = require('./WarehouseClosedDate');

class Warehouse extends Model {
  static active(query) {
    return query.where({ active: true });
  }

  static filter(query, filter) {
    return query
      .where(filter.region_id ? { region_id: filter.region_id } : {})
      .where(filter.country_id ? { country_id: filter.country_id } : {})
      .where(filter.city_id ? { city_id: filter.city_id } : {})
      .where(filter.area_id ? { area_id: filter.area_id } : {})
      .where(typeof filter.active !== 'undefined' ? { active: filter.active } : {});
  }
}

Warehouse.init(
  {
    id: {
      type: DataTypes.BIGINT, // BIGINT to match BIGSERIAL
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    region_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: 'regions', key: 'id' },
    },
    country_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
    },
    city_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: 'cities', key: 'id' },
    },
    area_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: { model: 'areas', key: 'id' },
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Warehouse',
    tableName: 'warehouses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Define relationships
Warehouse.hasOne(WarehouseTranslation, { foreignKey: 'warehouse_id' });
Warehouse.hasMany(WarehouseTranslation, { foreignKey: 'warehouse_id', as: 'translations' });
Warehouse.hasMany(WarehouseWorkingDay, { foreignKey: 'warehouse_id', as: 'workingDays' });
Warehouse.hasMany(WarehouseClosedDate, { foreignKey: 'warehouse_id', as: 'closedDates' });

module.exports = Warehouse;
