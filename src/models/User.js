// src/models/User.js
module.exports = (sequelize, DataTypes) => {
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
    r_count: { type: DataTypes.DOUBLE, defaultValue: 0 },
    r_avg: { type: DataTypes.DOUBLE, defaultValue: 0 },
    r_sum: { type: DataTypes.DOUBLE, defaultValue: 0 },
    o_count: { type: DataTypes.DOUBLE, defaultValue: 0 },
    o_sum: { type: DataTypes.DOUBLE, defaultValue: 0 },
    remember_token: { type: DataTypes.STRING },
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
// ✅ Helper Method
  User.prototype.getFullName = function () {
    return `${this.firstname} ${this.lastname || ''}`.trim();
  };

  // ✅ Association Setup
  User.associate = (models) => {
  User.belongsToMany(models.Role, {
    as: 'roles',
    through: {
      model: models.ModelHasRole,
      scope: {
        model_type: 'User',
      },
    },
    foreignKey: 'model_id',
    otherKey: 'role_id',
    constraints: false,
  });
};


  return User;
};


// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const models = require('./index'); // Import all models to ensure associations are set up

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//   id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
//   uuid: { type: DataTypes.STRING(36), allowNull: false },
//   firstname: { type: DataTypes.STRING, allowNull: false, defaultValue: 'firstname' },
//   lastname: { type: DataTypes.STRING },
//   email: { type: DataTypes.STRING },
//   phone: { type: DataTypes.STRING },
//   birthday: { type: DataTypes.DATE },
//   gender: { type: DataTypes.STRING, allowNull: false, defaultValue: 'male' },
//   email_verified_at: { type: DataTypes.DATE },
//   phone_verified_at: { type: DataTypes.DATE },
//   ip_address: { type: DataTypes.STRING },
//   active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
//   img: { type: DataTypes.STRING },
//   password: { type: DataTypes.STRING },
//   verify_token: { type: DataTypes.STRING },
//   my_referral: { type: DataTypes.STRING, defaultValue: 'YmbFrKPu' },
//   referral: { type: DataTypes.STRING },
//   firebase_token: { type: DataTypes.JSON },
//   // location: { type: DataTypes.STRING },
//   r_count: { type: DataTypes.DOUBLE, defaultValue: 0 },
//   r_avg: { type: DataTypes.DOUBLE, defaultValue: 0 },
//   r_sum: { type: DataTypes.DOUBLE, defaultValue: 0 },
//   o_count: { type: DataTypes.DOUBLE, defaultValue: 0 },
//   o_sum: { type: DataTypes.DOUBLE, defaultValue: 0 },
//   remember_token: { type: DataTypes.STRING },
//   // razorpay_customer_id: { type: DataTypes.STRING },
//   created_at: { type: DataTypes.DATE },
//   updated_at: { type: DataTypes.DATE },
//   currency_id: { type: DataTypes.BIGINT },
//   lang: { type: DataTypes.STRING,  },
// }, {
//   tableName: 'users',
//   timestamps: true,
//   createdAt: 'created_at',
//   updatedAt: 'updated_at',
// });

// // ✅ Custom methods
// User.prototype.isOnline = async function () {
//   return false; // replace with actual cache logic if needed
// };

// User.prototype.getRole = async function () {
//   const roles = await this.getRoles();
//   return roles.length > 0 ? roles[roles.length - 1].name : 'no role';
// };

// User.prototype.getNameOrEmail = function () {
//   return this.firstname || this.email;
// };

// User.prototype.getFullName = function () {
//   return `${this.firstname} ${this.lastname || ''}`.trim();
// };

// // ✅ Scopes
// User.addScope('filter', (filter) => {
//   const moment = require('moment');
//   return {
//     include: [
//       { model: sequelize.models.Role, as: 'roles', required: false },
//       { model: sequelize.models.Shop, as: 'shop', required: false },
//       { model: sequelize.models.Wallet, as: 'wallet', required: false },
//     ],
//     where: {
//       ...(typeof filter.active !== 'undefined' && { active: filter.active }),
//     },
//     order: [['id', 'desc']],
//   };
// });

// // Associations
// User.belongsToMany(models.Role, {
//   as: 'roles',
//   through: {
//     model: models.ModelHasRole,
//     scope: {
//       model_type: 'User'
//     }
//   },
//   foreignKey: 'model_id',
//   otherKey: 'role_id',
//   constraints: false
// });


// module.exports = User;
