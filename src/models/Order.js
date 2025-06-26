const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // your PostgreSQL connection

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1',
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  shop_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  parent_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  deliveryman_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  currency_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  delivery_price_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  delivery_point_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  address_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'new',
  },
  total_price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  wallet_amount_applied: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  commission_fee: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  service_fee: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  delivery_fee: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  total_discount: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  total_tax: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 1,
  },
  rate: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 1.00,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  delivery_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  delivery_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'point',
  },
  img: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  canceled_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  track_name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  track_id: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  track_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  current: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  coupon_price: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  cart_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  tips: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  otp: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Order;
