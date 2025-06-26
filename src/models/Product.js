const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    brand_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    unit_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tax: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    min_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    max_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2147483647,
    },
    digital: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    age_limit: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    interval: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1,
    },
    status_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    r_count: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    r_avg: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    r_sum: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    o_count: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    od_count: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    min_price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    max_price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    currency_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      defaultValue: 'N/A',
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: false, // Because you’re manually setting created_at/updated_at
  }
);

module.exports = Product;
