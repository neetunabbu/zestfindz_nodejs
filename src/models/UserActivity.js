const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Update path as per your config
const User = require('./User');
const Product = require('./Product');
const Shop = require('./Shop');

class UserActivity extends Model {
  static associate(models) {
    UserActivity.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

    // Polymorphic relation — implement as a workaround
    // Define polymorphic manually in service/repository if needed
  }

  static TYPES = {
    product: 'Product',
    shop: 'Shop'
  };

  static filter(query, filters = {}) {
    const where = {};

    if (filters.model_type && UserActivity.TYPES[filters.model_type]) {
      where.model_type = UserActivity.TYPES[filters.model_type];
    }
    if (filters.model_id) where.model_id = filters.model_id;
    if (filters.user_id) where.user_id = filters.user_id;
    if (filters.type) where.type = filters.type;
    if (filters.value) where.value = filters.value;
    if (filters.ip) where.ip = filters.ip;
    if (filters.device) where.device = filters.device;
    if (filters.agent) where.agent = filters.agent;
    if (filters.created_at) where.created_at = filters.created_at;
    if (filters.date_from) where.created_at = { ...where.created_at, [Op.gte]: filters.date_from };
    if (filters.date_to) where.created_at = { ...where.created_at, [Op.lte]: filters.date_to };

    return query.where(where);
  }
}

UserActivity.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  model_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true
  },
  agent: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'UserActivity',
  tableName: 'user_activities',
  timestamps: false,
  underscored: true
});

module.exports = UserActivity;
