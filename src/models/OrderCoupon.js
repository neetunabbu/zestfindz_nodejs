module.exports = (sequelize, DataTypes) => {
  const OrderCoupon = sequelize.define('OrderCoupon', {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    tableName: 'order_coupons',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
  });

  OrderCoupon.associate = (models) => {
    OrderCoupon.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });
    OrderCoupon.belongsTo(models.Coupon, {
      foreignKey: 'coupon_id',
      as: 'coupon',
    });
  };

  return OrderCoupon;
};
