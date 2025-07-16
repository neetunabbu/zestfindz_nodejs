const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    tag: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    input: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    sandbox: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    tableName: 'payments',
    timestamps: false, // Set to true if you want Sequelize to manage createdAt/updatedAt
    underscored: true
  });

  Payment.associate = (models) => {
    Payment.hasMany(models.PaymentPayload, {
      foreignKey: 'payment_id',
      as: 'payloads',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Payment;
};
