const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const User = require('./User');

class UserPoint extends Model {}

UserPoint.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT, // matches PostgreSQL BIGINT
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    price: {
      type: DataTypes.DECIMAL(20, 2), // precise NUMERIC equivalent
      allowNull: false,
      defaultValue: 0.00,
    },
  },
  {
    sequelize,
    modelName: 'UserPoint',
    tableName: 'user_points',
    timestamps: false,
    underscored: true, // optional: if you want to enforce snake_case column mapping
  }
);

// Define the BelongsTo relationship
UserPoint.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = UserPoint;
