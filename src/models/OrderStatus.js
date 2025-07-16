// models/OrderStatus.js
module.exports = (sequelize, DataTypes) => {
  const OrderStatus = sequelize.define('OrderStatus', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'order_statuses',
    timestamps: false, // No createdAt/updatedAt fields in this table
    underscored: true,
  });

  return OrderStatus;
};
