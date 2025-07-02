const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Subscription extends Model {}

Subscription.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'order'
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),  // ← corrected type
    allowNull: false
  },
  month: {
    type: DataTypes.SMALLINT,        // precise match for SMALLINT
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_limit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_limit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  with_report: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Subscription',
  tableName: 'subscriptions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = Subscription;
