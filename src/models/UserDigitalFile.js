// File: src/models/UserDigitalFile.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path to your DB config

class UserDigitalFile extends Model {}

UserDigitalFile.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    digital_file_id: {
      type: DataTypes.BIGINT.UNSIGNED,
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
    sequelize,
    modelName: 'UserDigitalFile',
    tableName: 'user_digital_files',
    timestamps: true,
    underscored: true,
  }
);

module.exports = UserDigitalFile;