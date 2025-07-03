const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const User = require('./User');
const Currency = require('./Currency');
const WalletHistory = require('./WalletHistory');
const Transaction = require('./Transaction');

class Wallet extends Model {}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Currency,
        key: 'id',
      },
    },
    price: {
      type: DataTypes.DECIMAL,  // precise equivalent of NUMERIC
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
  },
  {
    sequelize,
    modelName: 'Wallet',
    tableName: 'wallets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Relationships
Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Wallet.belongsTo(Currency, { foreignKey: 'currency_id', as: 'currency' });
Wallet.hasMany(WalletHistory, { foreignKey: 'wallet_uuid', sourceKey: 'uuid', as: 'histories' });
Wallet.hasMany(Transaction, { foreignKey: 'wallet_id', as: 'transactions' });

module.exports = Wallet;
