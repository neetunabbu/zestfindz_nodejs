const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Wallet = require('./Wallet');
const Transaction = require('./Transaction');
const User = require('./User');

class WalletHistory extends Model {
  static PROCESSED = 'processed';
  static PAID = 'paid';
  static REJECTED = 'rejected';
  static CANCELED = 'canceled';

  static TYPES = ['topup', 'withdraw', 'referral_from_topup', 'referral_from_withdraw'];

  static STATUSES = {
    [WalletHistory.PROCESSED]: WalletHistory.PROCESSED,
    [WalletHistory.PAID]: WalletHistory.PAID,
    [WalletHistory.REJECTED]: WalletHistory.REJECTED,
    [WalletHistory.CANCELED]: WalletHistory.CANCELED,
  };
}

WalletHistory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
    },
    wallet_uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: Wallet,
        key: 'uuid',
      },
    },
    transaction_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: Transaction,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'topup',
    },
    price: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('processed', 'paid', 'rejected', 'canceled'),
      allowNull: false,
      defaultValue: 'processed',
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
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
    modelName: 'WalletHistory',
    tableName: 'wallet_histories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Associations
WalletHistory.belongsTo(Wallet, { foreignKey: 'wallet_uuid', targetKey: 'uuid' });
WalletHistory.belongsTo(Transaction, { foreignKey: 'transaction_id' });
WalletHistory.belongsTo(User, { foreignKey: 'created_by', as: 'author' });

module.exports = WalletHistory;
