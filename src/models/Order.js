// models/Order.js

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1',
      comment: 'in_house, seller'
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    deliveryman_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    currency_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    delivery_price_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    delivery_point_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    address_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'new',
    },
    total_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    wallet_amount_applied: {
      type: DataTypes.DOUBLE(15, 2),
      defaultValue: 0.00,
    },
    commission_fee: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    service_fee: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    delivery_fee: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    total_discount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    total_tax: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1,
    },
    rate: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false,
      defaultValue: 1.00,
    },
    note: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delivery_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'point',
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    canceled_note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    track_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    coupon_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    cart_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    tips: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      comment: 'Tips',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    otp: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    fixed_fee: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.00,
    },
    gst_on_fees: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.00,
    },
    tcs: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.00,
    },
    delivery_fee_seller: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.00,
    },
    payment_gateway_fee: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.00,
    },
    commission_amount: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.00,
    },
    total_fees: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.00,
    },
    total_deductions: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.00,
    },
    final_seller_payout: {
      type: DataTypes.DOUBLE(10, 2),
      defaultValue: 0.00,
    },
  }, {
    tableName: 'orders',
    timestamps: false,
    underscored: true,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Order.belongsTo(models.User, { foreignKey: 'deliveryman_id', as: 'deliveryman' });
    Order.belongsTo(models.Currency, { foreignKey: 'currency_id', as: 'currency' });
    Order.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    Order.belongsTo(models.Order, { foreignKey: 'parent_id', as: 'parent' });
    Order.belongsTo(models.UserAddress, { foreignKey: 'address_id', as: 'addressDetails' });
    Order.belongsTo(models.DeliveryPoint, { foreignKey: 'delivery_point_id', as: 'deliveryPoint' });
    Order.belongsTo(models.DeliveryPrice, { foreignKey: 'delivery_price_id', as: 'deliveryPrice' });
  };

  return Order;
};
