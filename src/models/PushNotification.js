const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Order = require('./Order');
const Blog = require('./Blog');

class PushNotification extends Model {
  static NEW_ORDER = 'new_order';
  static NEW_PARCEL_ORDER = 'new_parcel_order';
  static NEW_USER_BY_REFERRAL = 'new_user_by_referral';
  static STATUS_CHANGED = 'status_changed';
  static NEWS_PUBLISH = 'news_publish';
  static NOTIFICATIONS = 'notifications';
  static ADD_CASHBACK = 'add_cashback';
  static WALLET_TOP_UP = 'wallet_top_up';
  static WALLET_WITHDRAW = 'wallet_withdraw';
  static SHOP_APPROVED = 'shop_approved';

  static TYPES = {
    [PushNotification.NEW_ORDER]: PushNotification.NEW_ORDER,
    [PushNotification.NEW_PARCEL_ORDER]: PushNotification.NEW_PARCEL_ORDER,
    [PushNotification.NEW_USER_BY_REFERRAL]: PushNotification.NEW_USER_BY_REFERRAL,
    [PushNotification.STATUS_CHANGED]: PushNotification.STATUS_CHANGED,
    [PushNotification.NEWS_PUBLISH]: PushNotification.NEWS_PUBLISH,
    [PushNotification.ADD_CASHBACK]: PushNotification.ADD_CASHBACK,
    [PushNotification.WALLET_TOP_UP]: PushNotification.WALLET_TOP_UP,
    [PushNotification.WALLET_WITHDRAW]: PushNotification.WALLET_WITHDRAW,
    [PushNotification.SHOP_APPROVED]: PushNotification.SHOP_APPROVED,
  };
}

PushNotification.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    model_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: 'PushNotification',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
  }
);

// Relationships
PushNotification.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

// Optional manual polymorphic-like behavior
PushNotification.belongsTo(Order, {
  foreignKey: 'model_id',
  constraints: false,
  as: 'orderModel'
});

PushNotification.belongsTo(Blog, {
  foreignKey: 'model_id',
  constraints: false,
  as: 'blogModel'
});

module.exports = PushNotification;
