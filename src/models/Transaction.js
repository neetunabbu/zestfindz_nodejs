// models/Transaction.js

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    payable_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payable_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    payment_sys_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    payment_trx_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    razor_pay_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    },
    perform_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refund_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('progress', 'paid', 'canceled', 'rejected', 'refund', 'refund_failed'),
      allowNull: false,
      defaultValue: 'progress'
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
    tableName: 'transactions',
    underscored: true,
    timestamps: false
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Optional: add polymorphic associations if needed (payable_type/payable_id)
  };

  return Transaction;
};
