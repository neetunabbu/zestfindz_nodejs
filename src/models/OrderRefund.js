// models/OrderRefund.js

module.exports = (sequelize, DataTypes) => {
  const OrderRefund = sequelize.define('OrderRefund', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'canceled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    cause: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order_id: {
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
    tableName: 'order_refunds',
    timestamps: false,
    underscored: true,
  });

  OrderRefund.associate = (models) => {
    OrderRefund.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return OrderRefund;
};

