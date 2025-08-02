const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ShopReview = sequelize.define('ShopReview', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'shop_reviews',
    underscored: true,
    timestamps: false,
  });

  // Define associations
  ShopReview.associate = (models) => {
    ShopReview.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
    });
    ShopReview.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return ShopReview;
};
