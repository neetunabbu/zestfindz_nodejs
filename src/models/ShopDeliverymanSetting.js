const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class ShopDeliverymanSetting extends Model {}

ShopDeliverymanSetting.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  shop_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['fix', 'percent']]
    }
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  period: {
    type: DataTypes.SMALLINT,
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
  modelName: 'ShopDeliverymanSetting',
  tableName: 'shop_deliveryman_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true // Prevent pluralizing
});

module.exports = ShopDeliverymanSetting;
