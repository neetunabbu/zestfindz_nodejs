const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class BannerProduct extends Model {}

// ✅ Model Definition
BannerProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    banner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'BannerProduct',
    tableName: 'banner_products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// ✅ Associations
BannerProduct.associate = (models) => {
  BannerProduct.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  BannerProduct.belongsTo(models.Banner, { foreignKey: 'banner_id', as: 'banner' });
};

module.exports = BannerProduct;
