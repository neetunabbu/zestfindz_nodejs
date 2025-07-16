// models/shopAdsProduct.model.js

module.exports = (sequelize, DataTypes) => {
  const ShopAdsProduct = sequelize.define('ShopAdsProduct', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    shop_ads_package_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    position_page: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
      comment: 'На какой странице будет выходить'
    }
  }, {
    tableName: 'shop_ads_products',
    timestamps: false,
    underscored: true
  });

  // Define associations here
  ShopAdsProduct.associate = models => {
    ShopAdsProduct.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    ShopAdsProduct.belongsTo(models.ShopAdsPackage, {
      foreignKey: 'shop_ads_package_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return ShopAdsProduct;
};
