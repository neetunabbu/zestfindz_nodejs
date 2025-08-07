module.exports = (sequelize, DataTypes) => {
  const CouponTranslation = sequelize.define('CouponTranslation', {
    coupon_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'coupon_translations',
    timestamps: false,
    underscored: true,
    freezeTableName: true,
  });

  CouponTranslation.associate = (models) => {
    CouponTranslation.belongsTo(models.Coupon, {
      foreignKey: 'coupon_id',
      as: 'coupon',
    });
  };

  return CouponTranslation;
};
