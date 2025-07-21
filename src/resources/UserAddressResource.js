// resources/UserAddressResource.js

const moment = require('moment');
const UserResource = require('./UserResource');
const OrderResource = require('./OrderResource');
const RegionResource = require('./RegionResource');
const CountryResource = require('./CountryResource');
const AreaResource = require('./AreaResource');

class UserAddressResource {
  static toJson(address, options = {}) {
    return {
      id: address.id ?? undefined,
      title: address.title ?? undefined,
      user_id: address.user_id ?? undefined,
      active: address.active ?? false,
      address: address.address ?? undefined,
      location: address.location ?? undefined,
      city_name: address.city ?? undefined,
      firstname: address.firstname ?? undefined,
      lastname: address.lastname ?? undefined,
      phone: address.phone ?? undefined,
      zipcode: address.zipcode ?? undefined,
      street_house_number: address.street_house_number ?? undefined,
      additional_details: address.additional_details ?? undefined,
      region_id: address.region_id ?? undefined,
      country_id: address.country_id ?? undefined,
      address_type: address.address_type ?? undefined,
      area_id: address.area_id ?? undefined,

      created_at: address.createdAt
        ? moment(address.createdAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,

      updated_at: address.updatedAt
        ? moment(address.updatedAt).utc().format('YYYY-MM-DD HH:mm:ss') + 'Z'
        : undefined,

      user: address.user ? UserResource.toJson(address.user) : undefined,
      orders: Array.isArray(address.orders)
        ? address.orders.map(o => OrderResource.toJson(o))
        : undefined,
      region: address.region ? RegionResource.toJson(address.region) : undefined,
      country: address.country ? CountryResource.toJson(address.country) : undefined,
      area: address.area ? AreaResource.toJson(address.area) : undefined,
    };
  }
}

module.exports = UserAddressResource;
