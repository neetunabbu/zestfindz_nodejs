const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class UserAddress extends Model {}

UserAddress.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  firstname: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  zipcode: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  street_house_number: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  additional_details: {
    type: DataTypes.STRING(191),
    allowNull: true,
  },
  region_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 1,
  },
  country_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    defaultValue: 1,
  },
  city_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  area_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  city: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  state: {
    type: DataTypes.TEXT,
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
}, {
  sequelize,
  modelName: 'UserAddress',
  tableName: 'user_addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// ✅ No associations/relationships at all

module.exports = UserAddress;
