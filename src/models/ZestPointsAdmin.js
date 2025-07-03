const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class ZestPointsAdmin extends Model {}

ZestPointsAdmin.init(
  {
    id: {
      type: DataTypes.SMALLINT, // match DB SMALLINT
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    referal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    more_than_thousand: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    more_than_2000: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  },
  {
    sequelize,
    modelName: 'ZestPointsAdmin',
    tableName: 'zest_points_admin',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = ZestPointsAdmin;
