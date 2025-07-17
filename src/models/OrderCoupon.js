// File: D:/zestfindz_nodejs/src/models/OrderCoupon.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');

class OrderCoupon extends Model {}

OrderCoupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'OrderCoupon',
    tableName: 'order_coupons',
    timestamps: false,
  }
);

OrderCoupon.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = OrderCoupon;
