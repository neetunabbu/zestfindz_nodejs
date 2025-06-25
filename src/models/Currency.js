const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

// Simple in-memory cache for currenciesList
const cache = {
  data: null,
  timestamp: null,
  TTL: 86400 * 1000 // 1 day in milliseconds
};

class Currency extends Model {
  static async currenciesList() {
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.TTL) {
      return cache.data;
    }
    const currencies = await this.findAll({
      order: [['default', 'DESC']]
    });
    cache.data = currencies;
    cache.timestamp = now;
    return currencies;
  }
}

Currency.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rate: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  default: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  modelName: 'Currency',
  tableName: 'currencies',
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  paranoid: false,
  defaultScope: {
    attributes: { exclude: [] } // No guarded fields except id, handled by primaryKey
  }
});

module.exports = Currency;