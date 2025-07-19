// src/models/WalletHistory.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Adjust based on your DB config
const { WALLET_STATUSES, WALLET_TYPES } = require('../constants/wallet'); // Optional constants file
const Wallet = require('./Wallet');
const User = require('./User');
const Transaction = require('./Transaction');

class WalletHistory extends Model {
  get price_rate() {
    // Mimic getPriceRateAttribute() logic
    const apiPath = global.currentRequestPath || ''; // Set this manually per request
    if (apiPath.includes('/api/v1/dashboard/user/') || apiPath.includes('/api/v1/rest/')) {
      return this.price * this.currency(); // You need to implement `currency()` logic
    }
    return this.price;
  }

  // Dummy currency method (you should update with real logic)
  currency() {
    return 1; // Or dynamic logic per currency, e.g. from wallet
  }
}

WalletHistory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wallet_uuid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('topup', 'withdraw', 'referral_from_topup', 'referral_from_withdraw'),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  price_rate: {
    type: DataTypes.VIRTUAL, // Calculated on the fly
    get() {
      const apiPath = global.currentRequestPath || '';
      if (apiPath.includes('/api/v1/dashboard/user/') || apiPath.includes('/api/v1/rest/')) {
        return this.getDataValue('price') * 1; // Replace with dynamic currency logic
      }
      return this.getDataValue('price');
    },
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('processed', 'paid', 'rejected', 'canceled'),
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'WalletHistory',
  tableName: 'wallet_histories',
  timestamps: true,
  underscored: true,
});


// === Associations ===
WalletHistory.belongsTo(Wallet, {
  foreignKey: 'wallet_uuid',
  targetKey: 'uuid',
  as: 'wallet',
});

WalletHistory.belongsTo(Transaction, {
  foreignKey: 'transaction_id',
  as: 'transaction',
});

WalletHistory.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'author',
});

// Simulating hasOneThrough relation (Laravel style) is not directly supported in Sequelize.
// You can simulate via custom query or add `wallet -> user` include in service layer

module.exports = WalletHistory;
