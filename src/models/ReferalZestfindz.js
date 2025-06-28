const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const User = require('./User');

class ReferalZestfindz extends Model {}

ReferalZestfindz.init(
  {
    code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
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
    sequelize,
    modelName: 'ReferalZestfindz',
    tableName: 'referal_zestfindz',
    underscored: true,
    timestamps: true,      // enables created_at and updated_at
    freezeTableName: true, // keeps table name as is
  }
);

// Relationship
ReferalZestfindz.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

module.exports = ReferalZestfindz;
