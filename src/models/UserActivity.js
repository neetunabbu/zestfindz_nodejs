const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class UserActivity extends Model {
  static TYPES = {
    product: 'App\\Models\\Product',
    shop: 'App\\Models\\Shop'
  };

  static filter(query, filter = {}) {
    return query
      .where(filter.model_type ? { model_type: UserActivity.TYPES[filter.model_type] || filter.model_type } : {})
      .where(filter.model_id ? { model_id: filter.model_id } : {})
      .where(filter.user_id ? { user_id: filter.user_id } : {})
      .where(filter.type ? { type: filter.type } : {})
      .where(filter.value ? { value: filter.value } : {})
      .where(filter.ip ? { ip: filter.ip } : {})
      .where(filter.device ? { device: filter.device } : {})
      .where(filter.agent ? { agent: filter.agent } : {})
      .where(filter.created_at ? { created_at: filter.created_at } : {})
      .where(filter.date_from ? { created_at: { [Op.gte]: filter.date_from } } : {})
      .where(filter.date_to ? { created_at: { [Op.lte]: filter.date_to } } : {});
  }
}

UserActivity.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  model_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true
  },
  agent: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  sequelize,
  modelName: 'UserActivity',
  tableName: 'user_activities',
  timestamps: false,
  underscored: true
});

// Relationships
UserActivity.associate = (models) => {
  UserActivity.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  UserActivity.belongsToMany(models.Product, {
    through: 'model',
    foreignKey: 'model_id',
    otherKey: 'id',
    constraints: false,
    scope: { model_type: 'App\\Models\\Product' },
    as: 'product'
  });

  UserActivity.belongsToMany(models.Shop, {
    through: 'model',
    foreignKey: 'model_id',
    otherKey: 'id',
    constraints: false,
    scope: { model_type: 'App\\Models\\Shop' },
    as: 'shop'
  });
};

module.exports = UserActivity;
