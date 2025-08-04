// src/app/Observers/RegionRelationsObserver.js

const Area = require('../../models/Area');
const City = require('../../models/City');
const Country = require('../../models/Country');
const Cart = require('../../models/Cart');
const DeliveryPoint = require('../../models/DeliveryPoint');
const DeliveryPrice = require('../../models/DeliveryPrice');
const ShopLocation = require('../../models/ShopLocation');
const UserAddress = require('../../models/UserAddress');

/**
 * Handle the Area "updated" event.
 * @param {Object} model - Area model instance
 */
const area = async (model) => {
  const updateData = {
    region_id: model.region_id,
    country_id: model.country_id,
    city_id: model.city_id,
  };

  await Promise.all([
    DeliveryPrice.update(updateData, { where: { area_id: model.id } }),
    DeliveryPoint.update(updateData, { where: { area_id: model.id } }),
    UserAddress.update(updateData, { where: { area_id: model.id } }),
    Cart.update(updateData, { where: { area_id: model.id } }),
    ShopLocation.update(updateData, { where: { area_id: model.id } }),
  ]);
};

/**
 * Handle the City "updated" event.
 * @param {Object} model - City model instance
 */
const city = async (model) => {
  const updateData = {
    region_id: model.region_id,
    country_id: model.country_id,
  };

  await Promise.all([
    DeliveryPrice.update(updateData, { where: { city_id: model.id } }),
    DeliveryPoint.update(updateData, { where: { city_id: model.id } }),
    UserAddress.update(updateData, { where: { city_id: model.id } }),
    Cart.update(updateData, { where: { city_id: model.id } }),
    ShopLocation.update(updateData, { where: { city_id: model.id } }),
  ]);
};

/**
 * Handle the Country "updated" event.
 * @param {Object} model - Country model instance
 */
const country = async (model) => {
  const updateData = {
    region_id: model.region_id,
  };

  await Promise.all([
    DeliveryPrice.update(updateData, { where: { country_id: model.id } }),
    DeliveryPoint.update(updateData, { where: { country_id: model.id } }),
    UserAddress.update(updateData, { where: { country_id: model.id } }),
    Cart.update(updateData, { where: { country_id: model.id } }),
    ShopLocation.update(updateData, { where: { country_id: model.id } }),
  ]);
};

module.exports = {
  area,
  city,
  country,
};
