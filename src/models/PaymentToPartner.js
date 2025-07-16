// models/PaymentToPartner.js

module.exports = (sequelize, DataTypes) => {
  const PaymentToPartner = sequelize.define('PaymentToPartner', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'seller',
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
    tableName: 'payment_to_partners',
    timestamps: false, // You can set true if using Sequelize timestamps
    underscored: true,
  });

  PaymentToPartner.associate = (models) => {
    PaymentToPartner.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    PaymentToPartner.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return PaymentToPartner;
};
