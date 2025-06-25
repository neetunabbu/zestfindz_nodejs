const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  uuid: { type: DataTypes.STRING(36), allowNull: false },
  firstname: { type: DataTypes.STRING, allowNull: false, defaultValue: 'firstname' },
  lastname: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  birthday: { type: DataTypes.DATE },
  gender: { type: DataTypes.STRING, allowNull: false, defaultValue: 'male' },
  email_verified_at: { type: DataTypes.DATE },
  phone_verified_at: { type: DataTypes.DATE },
  ip_address: { type: DataTypes.STRING },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  img: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  verify_token: { type: DataTypes.STRING },
  my_referral: { type: DataTypes.STRING, defaultValue: 'YmbFrKPu' },
  referral: { type: DataTypes.STRING },
  firebase_token: { type: DataTypes.JSON },
  location: { type: DataTypes.STRING },
  r_count: { type: DataTypes.DOUBLE, defaultValue: 0 },
  r_avg: { type: DataTypes.DOUBLE, defaultValue: 0 },
  r_sum: { type: DataTypes.DOUBLE, defaultValue: 0 },
  o_count: { type: DataTypes.DOUBLE, defaultValue: 0 },
  o_sum: { type: DataTypes.DOUBLE, defaultValue: 0 },
  remember_token: { type: DataTypes.STRING },
  razorpay_customer_id: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE },
  currency_id: { type: DataTypes.BIGINT },
  lang: { type: DataTypes.STRING },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// ✅ Relationships (leave as-is if other models already declared properly)
User.hasMany(sequelize.models.Gallery, { as: 'galleries', foreignKey: 'user_id' });
User.hasMany(sequelize.models.Invitation, { as: 'invitations', foreignKey: 'user_id' });
User.hasOne(sequelize.models.Invitation, { as: 'invite', foreignKey: 'user_id' });
User.belongsToMany(sequelize.models.Banner, { as: 'likes', through: sequelize.models.Like, foreignKey: 'user_id' });
User.hasMany(sequelize.models.Review, { as: 'reviews', foreignKey: 'user_id' });
User.hasMany(sequelize.models.Review, { as: 'assignReviews', foreignKey: 'assignable_id', scope: { assignable_type: 'User' } });
User.belongsToMany(sequelize.models.Notification, { as: 'notifications', through: sequelize.models.NotificationUser, foreignKey: 'user_id', otherKey: 'notification_id' });
User.hasMany(sequelize.models.Order, { as: 'orders', foreignKey: 'user_id' });
User.hasMany(sequelize.models.Order, { as: 'deliveryManOrders', foreignKey: 'deliveryman_id' });
User.hasOne(sequelize.models.Wallet, { as: 'wallet', foreignKey: 'user_id' });
User.hasMany(sequelize.models.Transaction, { as: 'transactions', foreignKey: 'user_id' });
User.hasMany(sequelize.models.SocialProvider, { as: 'socialProviders', foreignKey: 'user_id' });
User.hasMany(sequelize.models.PersonalAccessToken, { as: 'tokens', foreignKey: 'tokenable_id', scope: { tokenable_type: 'User' } });
User.hasMany(sequelize.models.PaymentProcess, { as: 'paymentProcess', foreignKey: 'user_id' });
User.hasOne(sequelize.models.UserPoint, { as: 'point', foreignKey: 'user_id' });
User.hasMany(sequelize.models.PointHistory, { as: 'pointHistory', foreignKey: 'user_id' });
User.hasOne(sequelize.models.DeliveryManSetting, { as: 'deliveryManSetting', foreignKey: 'user_id' });
User.hasOne(sequelize.models.UserAddress, { as: 'address', foreignKey: 'user_id' });
User.hasMany(sequelize.models.UserAddress, { as: 'addresses', foreignKey: 'user_id' });
User.belongsTo(sequelize.models.Currency, { as: 'currency', foreignKey: 'currency_id' });
User.hasOne(sequelize.models.EmailSubscription, { as: 'emailSubscription', foreignKey: 'user_id' });
User.hasOne(sequelize.models.UserActivity, { as: 'activity', foreignKey: 'user_id' });
User.hasMany(sequelize.models.UserActivity, { as: 'activities', foreignKey: 'user_id' });
User.hasOne(sequelize.models.Shop, { as: 'shop', foreignKey: 'user_id' });
User.belongsToMany(sequelize.models.Role, { as: 'roles', through: sequelize.models.RoleUser, foreignKey: 'user_id' });
User.belongsToMany(sequelize.models.Permission, { as: 'permissions', through: sequelize.models.PermissionUser, foreignKey: 'user_id' });

// ✅ Custom methods
User.prototype.isOnline = async function () {
  return false; // replace with actual cache logic if needed
};

User.prototype.getRole = async function () {
  const roles = await this.getRoles();
  return roles.length > 0 ? roles[roles.length - 1].name : 'no role';
};

User.prototype.getNameOrEmail = function () {
  return this.firstname || this.email;
};

User.prototype.getFullName = function () {
  return `${this.firstname} ${this.lastname || ''}`.trim();
};

// ✅ Scopes
User.addScope('filter', (filter) => {
  const moment = require('moment');
  return {
    include: [
      { model: sequelize.models.Role, as: 'roles', required: false },
      { model: sequelize.models.Shop, as: 'shop', required: false },
      { model: sequelize.models.Wallet, as: 'wallet', required: false },
    ],
    where: {
      ...(typeof filter.active !== 'undefined' && { active: filter.active }),
    },
    order: [['id', 'desc']],
  };
});

module.exports = User;
