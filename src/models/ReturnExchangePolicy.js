const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class ReturnExchangePolicy extends Model {}

ReturnExchangePolicy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ corrected
    },
    html_code: {
      type: DataTypes.TEXT,
      allowNull: true, // ✅ corrected
    },
  },
  {
    sequelize,
    modelName: 'ReturnExchangePolicy',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
  }
);

module.exports = ReturnExchangePolicy;
