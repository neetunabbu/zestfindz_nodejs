const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection
const Shop = require('./Shop'); // Adjust path and capitalization

class ShopImageQualityScore extends Model {}

ShopImageQualityScore.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(6, 2), // Precision-safe match for NUMERIC(6,2)
      allowNull: false,
      defaultValue: 0,
    },
    breakdown: {
      type: DataTypes.JSONB, // JSONB type in PostgreSQL
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
  },
  {
    sequelize,
    modelName: 'ShopImageQualityScore',
    tableName: 'shop_image_quality_scores',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  }
);

// Define BelongsTo relationship
ShopImageQualityScore.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });

module.exports = ShopImageQualityScore;
