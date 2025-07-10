// src/models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/db');
const db = {};

const sequelize = config;

fs.readdirSync(__dirname)
  .filter(file =>
    file !== basename &&
    file.endsWith('.js') &&
    !file.startsWith('.')
  )
  .forEach(file => {
    try {
      const modelFile = require(path.join(__dirname, file));
      if (typeof modelFile === 'function') {
        const model = modelFile(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      } else {
        // console.warn(`⚠️  Skipped loading model "${file}" - not a function`);
      }
    } catch (err) {
      // console.error(`❌ Failed to load model "${file}":`, err.message);
    }
  });


// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
console.log('Loaded models:', Object.keys(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;



// src\models\index.js
// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const sequelize = require('../config/db'); // ✅ Database connection

// const db = {};

// // ✅ Dynamically import all models in the models folder
// fs.readdirSync(__dirname)
//   .filter((file) => file.endsWith('.js') && file !== 'index.js')
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file));
//     db[model.name] = model;
//   });

// // Setup associations
// Object.keys(db).forEach((modelName) => {
//   if (typeof db[modelName].associate === 'function') {
//     db[modelName].associate(db);
//   }
// });

// // Add User associations here if not already in User.associate
// if (db.User) {
//   db.User.hasMany(db.Gallery, { as: 'galleries', foreignKey: 'user_id' });
//   db.User.hasMany(db.Invitation, { as: 'invitations', foreignKey: 'user_id' });
//   db.User.hasOne(db.Invitation, { as: 'invite', foreignKey: 'user_id' });
//   db.User.belongsToMany(db.Banner, { as: 'likes', through: db.Like, foreignKey: 'user_id' });
//   db.User.hasMany(db.Review, { as: 'reviews', foreignKey: 'user_id' });
//   db.User.hasMany(db.Review, { as: 'assignReviews', foreignKey: 'assignable_id', scope: { assignable_type: 'User' } });
//   db.User.belongsToMany(db.Notification, { as: 'notifications', through: db.NotificationUser, foreignKey: 'user_id', otherKey: 'notification_id' });
//   db.User.hasMany(db.Order, { as: 'orders', foreignKey: 'user_id' });
//   db.User.hasMany(db.Order, { as: 'deliveryManOrders', foreignKey: 'deliveryman_id' });
//   db.User.hasOne(db.Wallet, { as: 'wallet', foreignKey: 'user_id' });
//   db.User.hasMany(db.Transaction, { as: 'transactions', foreignKey: 'user_id' });
//   db.User.hasMany(db.SocialProvider, { as: 'socialProviders', foreignKey: 'user_id' });
//   db.User.hasMany(db.PersonalAccessToken, { as: 'tokens', foreignKey: 'tokenable_id', scope: { tokenable_type: 'User' } });
//   db.User.hasMany(db.PaymentProcess, { as: 'paymentProcess', foreignKey: 'user_id' });
//   db.User.hasOne(db.UserPoint, { as: 'point', foreignKey: 'user_id' });
//   db.User.hasMany(db.PointHistory, { as: 'pointHistory', foreignKey: 'user_id' });
//   db.User.hasOne(db.DeliveryManSetting, { as: 'deliveryManSetting', foreignKey: 'user_id' });
//   db.User.hasOne(db.UserAddress, { as: 'address', foreignKey: 'user_id' });
//   db.User.hasMany(db.UserAddress, { as: 'addresses', foreignKey: 'user_id' });
//   db.User.belongsTo(db.Currency, { as: 'currency', foreignKey: 'currency_id' });
//   db.User.hasOne(db.EmailSubscription, { as: 'emailSubscription', foreignKey: 'user_id' });
//   db.User.hasOne(db.UserActivity, { as: 'activity', foreignKey: 'user_id' });
//   db.User.hasMany(db.UserActivity, { as: 'activities', foreignKey: 'user_id' });
//   db.User.hasOne(db.Shop, { as: 'shop', foreignKey: 'user_id' });
//   db.User.belongsToMany(db.Role, { as: 'roles', through: db.RoleUser, foreignKey: 'user_id' });
//   db.User.belongsToMany(db.Permission, { as: 'permissions', through: db.PermissionUser, foreignKey: 'user_id' });
// }

// ✅ Add Sequelize and connection to db object
// db.sequelize = sequelize;

// ✅ Show loaded models (optional - remove in production if needed)

// console.log('✅ Models Loaded:', Object.keys(db));

// module.exports = db;