const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');

class Shipment extends Model {}

Shipment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    waybill: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    upload_wbn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cod_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    serviceable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    refnum: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    client: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    response: {
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
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Shipment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true, // enables soft delete behavior on 'deleted_at'
    freezeTableName: true,
  }
);

// Relationship
Shipment.belongsTo(Order, { as: 'order', foreignKey: 'order_id' });

module.exports = Shipment;
