const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'fix',
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  expired_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  for: {  // 'for' is a reserved keyword so Sequelize treats it fine here
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'total_price',
  },
  shop_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Coupon',
  tableName: 'coupons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Coupon;

