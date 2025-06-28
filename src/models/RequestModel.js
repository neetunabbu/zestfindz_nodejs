const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');

class RequestModel extends Model {
  static CATEGORY = 'category';
  static PRODUCT = 'product';
  static USER = 'user';

  static STATUS_PENDING = 'pending';
  static STATUS_APPROVED = 'approved';
  static STATUS_CANCELED = 'canceled';

  static TYPES = {
    [RequestModel.CATEGORY]: 'Category',
    [RequestModel.PRODUCT]: 'Product',
    [RequestModel.USER]: 'User',
  };

  static BY_TYPES = {
    ['Category']: RequestModel.CATEGORY,
    ['Product']: RequestModel.PRODUCT,
    ['User']: RequestModel.USER,
  };

  static STATUSES = {
    [RequestModel.STATUS_PENDING]: RequestModel.STATUS_PENDING,
    [RequestModel.STATUS_APPROVED]: RequestModel.STATUS_APPROVED,
    [RequestModel.STATUS_CANCELED]: RequestModel.STATUS_CANCELED,
  };
}

RequestModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    model_type: {
      type: DataTypes.STRING,
      allowNull: true, // Matches DB default NULL
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Matches DB default NULL
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true, // Matches DB default NULL
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true, // Matches DB default NULL
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    status_note: {
      type: DataTypes.STRING,
      allowNull: true, // Matches DB default NULL
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
    modelName: 'RequestModel',
    tableName: 'request_models',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
  }
);

// Relationships
RequestModel.belongsTo(User, { as: 'createdBy', foreignKey: 'created_by' });

module.exports = RequestModel;
