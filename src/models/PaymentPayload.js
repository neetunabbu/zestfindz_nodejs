const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaymentPayload = sequelize.define('PaymentPayload', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    payment_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    tableName: 'payment_payloads',
    timestamps: false,
    underscored: true
  });

  PaymentPayload.associate = (models) => {
    PaymentPayload.belongsTo(models.Payment, {
      foreignKey: 'payment_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return PaymentPayload;
};
