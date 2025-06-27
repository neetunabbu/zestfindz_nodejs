const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class ShopAdsProduct extends Model {
  // No associations needed if you said no relations
  // But leaving them here commented if you later want them
  /*
  static associate(models) {
    this.belongsTo(models.ShopAdsPackage, { foreignKey: 'shop_ads_package_id' });
    this.belongsTo(models.Product, { foreignKey: 'product_id' });
  }
  */
}

ShopAdsProduct.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    shop_ads_package_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    position_page: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'ShopAdsProduct',
    tableName: 'shop_ads_products',
    timestamps: false,
    freezeTableName: true,
    underscored: true,
  }
);

module.exports = ShopAdsProduct;
