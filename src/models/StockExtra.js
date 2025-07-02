const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class StockExtra extends Model {}

StockExtra.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  stock_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  extra_group_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  extra_value_id: {
    type: DataTypes.INTEGER,
    allowNull: true // corrected here — matches nullable in PostgreSQL
  }
}, {
  sequelize,
  modelName: 'StockExtra',
  tableName: 'stock_extras',
  timestamps: false,
  underscored: true
});

// Associations
StockExtra.associate = (models) => {
  StockExtra.belongsTo(models.Stock, {
    foreignKey: 'stock_id',
    as: 'stock'
  });

  StockExtra.belongsTo(models.ExtraGroup, {
    foreignKey: 'extra_group_id',
    as: 'group'
  });

  StockExtra.belongsTo(models.ExtraValue, {
    foreignKey: 'extra_value_id',
    as: 'value'
  });
};

module.exports = StockExtra;
