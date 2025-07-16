// resources/CartResource.js

const UserResource = require('../UserResource');
const UserCartResource = require('./UserCartResource');
const RegionResource = require('../RegionResource');
const CountryResource = require('../CountryResource');
const CityResource = require('../CityResource');
const AreaResource = require('../AreaResource');

class CartResource {
  static toJSON(cart) {
    if (!cart) return null;

    return {
      id: cart.id,
      owner_id: cart.owner_id,
      status: cart.status,
      total_price: cart.rate_total_price, // Assumes aliased or virtual field, or fallback to cart.total_price
      currency_id: cart.currency_id,
      region_id: cart.region_id ?? null,
      country_id: cart.country_id ?? null,
      city_id: cart.city_id ?? null,
      area_id: cart.area_id ?? null,
      rate: cart.rate,
      group: !!cart.group,
      created_at: cart.created_at
        ? cart.created_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,
      updated_at: cart.updated_at
        ? cart.updated_at.toISOString().replace('T', ' ').slice(0, 19) + 'Z'
        : null,

      user: cart.user ? UserResource.toJSON(cart.user) : null,
      user_carts: cart.userCarts
        ? cart.userCarts.map(uc => UserCartResource.toJSON(uc))
        : [],
      region: cart.region ? RegionResource.toJSON(cart.region) : null,
      country: cart.country ? CountryResource.toJSON(cart.country) : null,
      city: cart.city ? CityResource.toJSON(cart.city) : null,
      area: cart.area ? AreaResource.toJSON(cart.area) : null,
    };
  }
}

module.exports = CartResource;
