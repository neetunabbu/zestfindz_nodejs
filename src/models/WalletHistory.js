const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WalletHistory = sequelize.define('WalletHistory', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  wallet_uuid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'topup',
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  note: {
    type: DataTypes.STRING,
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
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'wallet_histories',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['uuid'], unique: true },
    { fields: ['transaction_id'] },
    { fields: ['created_by'] },
  ],
});

// ✅ Relations
WalletHistory.associate = (models) => {
  WalletHistory.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'creator',
  });
  WalletHistory.belongsTo(models.Transaction, {
    foreignKey: 'transaction_id',
    as: 'transaction',
  });
};

module.exports = WalletHistory;


