const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payout = sequelize.define('Payout', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'canceled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    currency_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    payment_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cause: {
      type: DataTypes.STRING,
      allowNull: true
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'payouts',
    timestamps: false,
    underscored: true
  });

  Payout.associate = (models) => {
    Payout.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    Payout.belongsTo(models.User, {
      foreignKey: 'approved_by',
      as: 'approver',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    Payout.belongsTo(models.Currency, {
      foreignKey: 'currency_id',
      as: 'currency',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    Payout.belongsTo(models.Payment, {
      foreignKey: 'payment_id',
      as: 'payment',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return Payout;
};
