const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Adjust to your DB config path
const Warehouse = require('./Warehouse');

class WarehouseWorkingDay extends Model {
  static associate() {
    WarehouseWorkingDay.belongsTo(Warehouse, {
      foreignKey: 'warehouse_id',
      as: 'warehouse',
    });
  }

  static get DAYS() {
    return {
      monday: 'monday',
      tuesday: 'tuesday',
      wednesday: 'wednesday',
      thursday: 'thursday',
      friday: 'friday',
      saturday: 'saturday',
      sunday: 'sunday',
    };
  }

  static filter(queryParams = {}) {
    const { warehouse_id, day, from, to, disabled } = queryParams;
    const where = {};

    if (warehouse_id) where.warehouse_id = warehouse_id;
    if (day) where.day = day;
    if (from) where.from = { [sequelize.Op.gte]: from };
    if (to) where.to = { [sequelize.Op.lte]: to };
    if (disabled !== undefined) where.disabled = disabled;

    return this.findAll({ where });
  }
}

WarehouseWorkingDay.init(
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
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'WarehouseWorkingDay',
    tableName: 'warehouse_working_days',
    timestamps: true,
  }
);

module.exports = WarehouseWorkingDay;
