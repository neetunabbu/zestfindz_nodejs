// File: D:/zestfindz_nodejs/src/models/WarehouseClosedDate.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as needed
const Warehouse = require('./Warehouse');

class WarehouseClosedDate extends Model {
  static associate(models) {
    WarehouseClosedDate.belongsTo(models.Warehouse, {
      foreignKey: 'warehouse_id',
      as: 'warehouse',
    });
  }

  // Custom filter method similar to Laravel's scopeFilter
  static applyFilter(filter = {}) {
    const where = {};

    if (filter.warehouse_id) {
      where.warehouse_id = filter.warehouse_id;
    }

    if (filter.date_from) {
      where.date = { ...where.date, [sequelize.Op.gte]: filter.date_from };
    }

    if (filter.date_to) {
      where.date = { ...where.date, [sequelize.Op.lte]: filter.date_to };
    }

    return {
      where,
    };
  }
}

WarehouseClosedDate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'WarehouseClosedDate',
    tableName: 'warehouse_closed_dates',
    timestamps: true,
    underscored: true,
  }
);

module.exports = WarehouseClosedDate;
