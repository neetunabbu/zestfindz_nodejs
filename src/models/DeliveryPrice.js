// src/models/DeliveryPrice.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust the path as needed

class DeliveryPrice extends Model {
  static associate(models) {
    DeliveryPrice.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    DeliveryPrice.hasOne(models.DeliveryPriceTranslation, {
      foreignKey: 'delivery_price_id',
      as: 'translation',
    });
    DeliveryPrice.hasMany(models.DeliveryPriceTranslation, {
      foreignKey: 'delivery_price_id',
      as: 'translations',
    });
  }

  static applyFilters(query, filters = {}) {
    const { region_id, country_id, city_id, area_id, shop_id, search } = filters;

    if (region_id) query.where.region_id = region_id;

    if (country_id) {
      query.where.country_id = country_id;
      if (region_id) query.where.country_id = null;
    }

    if (city_id) {
      query.where.city_id = city_id;
      if (country_id) query.where.city_id = null;
    }

    if (area_id) {
      query.where.area_id = area_id;
      if (area_id) query.where.area_id = null;
    }

    if (shop_id) query.where.shop_id = shop_id;

    if (search) {
      query.include.push({
        model: sequelize.models.DeliveryPriceTranslation,
        as: 'translations',
        where: {
          title: {
            [sequelize.Op.like]: `%${search}%`
          }
        },
        attributes: ['id', 'delivery_price_id', 'locale', 'title']
      });
    }

    return query;
  }
}

DeliveryPrice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    region_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    area_id: DataTypes.INTEGER,
    shop_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'DeliveryPrice',
    tableName: 'delivery_prices',
    timestamps: false,
  }
);

module.exports = DeliveryPrice;
