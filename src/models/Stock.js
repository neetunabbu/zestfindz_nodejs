const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./product');
const Discount = require('./discount');
const Bonus = require('./bonus');
const OrderDetail = require('./orderDetail');
const CartDetail = require('./cartDetail');
const StockExtra = require('./stockExtra');
const ModelLog = require('./modelLog');
const WholeSalePrice = require('./wholeSalePrice');

class Stock extends Model {}

Stock.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  bonus_expired_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  discount_expired_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discount_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tax: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  o_count: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  od_count: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Stock',
  tableName: 'stocks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true, // if you want soft deletes
  underscored: true
});

// Associations
Stock.belongsTo(Product, { foreignKey: 'product_id' });
Stock.belongsTo(Discount, { foreignKey: 'discount_id' });
Stock.hasOne(Bonus, { foreignKey: 'stock_id' });
Stock.hasMany(Bonus, { foreignKey: 'bonus_stock_id', as: 'bonusByShop' });
Stock.hasMany(OrderDetail, { foreignKey: 'stock_id', as: 'orderDetails' });
Stock.hasOne(OrderDetail, { foreignKey: 'stock_id', as: 'orderDetail' });
Stock.hasMany(CartDetail, { foreignKey: 'stock_id', as: 'cartDetails' });
Stock.hasOne(StockExtra, { foreignKey: 'stock_id', as: 'stockExtra' });
Stock.hasMany(StockExtra, { foreignKey: 'stock_id', as: 'stockExtras' });
Stock.hasMany(ModelLog, { foreignKey: 'model_id', as: 'logs', constraints: false, scope: { model_type: 'Stock' } });
Stock.hasOne(WholeSalePrice, { foreignKey: 'stock_id', as: 'wholeSalePrice' });
Stock.hasMany(WholeSalePrice, { foreignKey: 'stock_id', as: 'wholeSalePrices' });

module.exports = Stock;
