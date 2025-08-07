const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const CartDetail = sequelize.define(
  'CartDetail',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_cart_id: {
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
  },
  {
    tableName: 'cart_details',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = CartDetail;
