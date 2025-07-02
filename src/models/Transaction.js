const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Transaction extends Model {
  static STATUS_PROGRESS = 'progress';
  static STATUS_PAID = 'paid';
  static STATUS_CANCELED = 'canceled';
  static STATUS_REJECTED = 'rejected';
  static STATUS_REFUND = 'refund';
  static STATUS_REFUND_FAILED = 'refund_failed';

  static STATUSES = {
    [Transaction.STATUS_PROGRESS]: Transaction.STATUS_PROGRESS,
    [Transaction.STATUS_PAID]: Transaction.STATUS_PAID,
    [Transaction.STATUS_CANCELED]: Transaction.STATUS_CANCELED,
    [Transaction.STATUS_REJECTED]: Transaction.STATUS_REJECTED,
    [Transaction.STATUS_REFUND]: Transaction.STATUS_REFUND,
    [Transaction.STATUS_REFUND_FAILED]: Transaction.STATUS_REFUND_FAILED
  };

  static filter(query, filter = {}) {
    return query
      .where(filter.model === 'orders' ? { payable_type: 'App\\Models\\Order' } : {})
      .where(filter.shop_id ? {
        [Op.and]: [
          { payable_type: 'App\\Models\\Order' },
          sequelize.where(
            sequelize.literal(
              '(SELECT shop_id FROM orders WHERE orders.id = "Transaction".payable_id)'
            ),
            filter.shop_id
          )
        ]
      } : {})
      .where(filter.model === 'wallet' ? { payable_type: 'App\\Models\\Wallet' } : {})
      .where(filter.user_id ? { user_id: filter.user_id } : {})
      .where(filter.status ? { status: filter.status } : {});
  }
}

Transaction.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  payable_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payable_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(15, 4),  // ✅ match NUMERIC(15, 4)
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  payment_sys_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  payment_trx_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  razor_pay_id: {                     // ✅ Added missing field
    type: DataTypes.STRING,
    allowNull: true
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  },
  perform_time: {
    type: DataTypes.DATE,             // ✅ was incorrectly STRING
    allowNull: true
  },
  refund_time: {
    type: DataTypes.DATE,             // ✅ was incorrectly STRING
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,           // ✅ Check constraint handled in DB — okay to remain string here
    allowNull: false
  },
  status_description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Relationships
Transaction.associate = (models) => {
  Transaction.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  Transaction.belongsTo(models.Payment, {
    foreignKey: 'payment_sys_id',
    as: 'paymentSystem'
  });

  Transaction.belongsToMany(models.Order, {
    through: 'payable',
    foreignKey: 'payable_id',
    otherKey: 'id',
    constraints: false,
    scope: { payable_type: 'App\\Models\\Order' },
    as: 'payable'
  });

  Transaction.belongsToMany(models.Wallet, {
    through: 'payable',
    foreignKey: 'payable_id',
    otherKey: 'id',
    constraints: false,
    scope: { payable_type: 'App\\Models\\Wallet' },
    as: 'payable'
  });
};

module.exports = Transaction;