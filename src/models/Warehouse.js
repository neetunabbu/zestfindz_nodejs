// File: src/models/Warehouse.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Warehouse extends Model {
  static associate(models) {
    // One-to-One
    Warehouse.hasOne(models.WarehouseTranslation, {
      foreignKey: 'warehouse_id',
      as: 'translation',
    });

    // One-to-Many
    Warehouse.hasMany(models.WarehouseTranslation, {
      foreignKey: 'warehouse_id',
      as: 'translations',
    });

    Warehouse.hasMany(models.WarehouseWorkingDay, {
      foreignKey: 'warehouse_id',
      as: 'workingDays',
    });

    Warehouse.hasMany(models.WarehouseClosedDate, {
      foreignKey: 'warehouse_id',
      as: 'closedDates',
    });
  }

  // Custom scopes
  static addScopes() {
    Warehouse.addScope('active', {
      where: { active: true },
    });

    Warehouse.addScope('filter', (filter = {}) => {
      const where = {};
      if (filter.region_id) where.region_id = filter.region_id;
      if (filter.country_id) where.country_id = filter.country_id;
      if (filter.city_id) where.city_id = filter.city_id;
      if (filter.area_id) where.area_id = filter.area_id;
      if (filter.hasOwnProperty('active')) where.active = filter.active;

      return { where };
    });
  }
}

Warehouse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    location: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Warehouse',
    tableName: 'warehouses',
    timestamps: true,
  }
);

// Load scopes
Warehouse.addScopes();

module.exports = Warehouse;
