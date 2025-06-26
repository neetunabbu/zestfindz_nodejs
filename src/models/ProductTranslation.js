const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class ProductTranslation extends Model {}

ProductTranslation.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING,  // same as VARCHAR(255)
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,  // same as VARCHAR(191)
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ProductTranslation',
    tableName: 'product_translations',
    timestamps: false,
    indexes: [
      {
        name: 'idx_product_translations_locale',
        fields: ['locale'],
      },
    ],
  }
);

module.exports = ProductTranslation;
