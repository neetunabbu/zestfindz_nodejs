// File: src/models/Coupon.js

module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    for: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'coupons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Coupon.associate = (models) => {
    Coupon.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
    });

    Coupon.hasMany(models.CouponTranslation, {
      foreignKey: 'coupon_id',
      as: 'translations',
    });

    Coupon.hasOne(models.CouponTranslation, {
      foreignKey: 'coupon_id',
      as: 'translation',
    });

    // Coupon.hasMany(models.OrderCoupon, {
    //   foreignKey: 'name',
    //   sourceKey: 'name',
    //   as: 'OrderCoupon',
    // });
  };

  // Scope-like method to mimic Laravel's checkCoupon()
  Coupon.checkCoupon = async function (couponName, shopId) {
    return await this.findOne({
      where: {
        name: couponName,
        shop_id: shopId,
        qty: { [sequelize.Sequelize.Op.gt]: 0 },
        expired_at: { [sequelize.Sequelize.Op.gt]: new Date() },
      },
    });
  };

  return Coupon;
};
