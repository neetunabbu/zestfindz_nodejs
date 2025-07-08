module.exports = (sequelize, DataTypes) => {
  // Simple in-memory cache for currenciesList
  const cache = {
    data: null,
    timestamp: null,
    TTL: 86400 * 1000 // 1 day in milliseconds
  };

  const Currency = sequelize.define('Currency', {
    id: {
      type: DataTypes.BIGINT,   // match BIGSERIAL
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    rate: {
      type: DataTypes.DECIMAL(9, 2),   // match NUMERIC(9,2)
      allowNull: false,
      defaultValue: 1.00
    },
    position: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'after'
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    tableName: 'currencies',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: false,
    defaultScope: {
      attributes: { exclude: [] }
    }
  });

  // Add the static method currenciesList to the Currency model
  Currency.currenciesList = async function() {
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.TTL) {
      return cache.data;
    }
    const currencies = await this.findAll({
      order: [['is_default', 'DESC']]
    });
    cache.data = currencies;
    cache.timestamp = now;
    return currencies;
  };

  return Currency;
};
