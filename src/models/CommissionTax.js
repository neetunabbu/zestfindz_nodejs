const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CommissionTax extends Model {}

CommissionTax.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    seller_commission: {
      type: DataTypes.INTEGER,  // match PostgreSQL INTEGER
      allowNull: false,
    },
    seller_tax: {
      type: DataTypes.INTEGER,  // match PostgreSQL INTEGER
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
    modelName: 'CommissionTax',
    tableName: 'commission_taxes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = CommissionTax;
