const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const Coupon = require('./Coupon'); // Must import the related model

class CouponTranslation extends Model {}

CouponTranslation.init({
  id: {
    type: DataTypes.BIGINT, // PostgreSQL BIGSERIAL
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  coupon_id: {
    type: DataTypes.BIGINT, // PostgreSQL BIGINT
    allowNull: false
  },
  locale: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(191), // Match VARCHAR(191)
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'CouponTranslation',
  tableName: 'coupon_translations',
  timestamps: false,
  underscored: true,
  freezeTableName: true
});

// Define relationship
CouponTranslation.belongsTo(Coupon, {
  foreignKey: 'coupon_id',
  as: 'coupon'
});

module.exports = CouponTranslation;
