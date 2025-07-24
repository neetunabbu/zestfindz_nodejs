// src/services/shopService.js

const { Op } = require('sequelize');
const { Shop, User, Gallery, ShopLocation, Language, Invitation, Order } = require('../../models');
const ResponseError = require('../../helpers/ResponseError');
const CoreService = require('../CoreService');
// const DelhiveryService = require('../DelhiveryService');
// const { reverseGeocode } = require('../../utils/geocoder');

class ShopService extends CoreService {
  constructor() {
    super(Shop);
  }

  async create(data) {
    const transaction = await Shop.sequelize.transaction();
    try {
      if (!data.user_id) throw new Error(ResponseError.ERROR_404);

      const seller = await User.findByPk(data.user_id, { include: ['roles'] });
      if (!seller || seller.roles.some(r => r.name === 'admin')) {
        throw new Error(ResponseError.ERROR_207);
      }

      const existingShop = await Shop.findOne({ where: { user_id: data.user_id } });
      if (existingShop) throw new Error(ResponseError.ERROR_206);

      const shop = await Shop.create({ ...this.setShopParams(data) }, { transaction });

      await this.setTranslations(shop, data);

      if (data.images?.[0]) {
        await shop.update({
          logo_img: data.images[0],
          background_img: data.images[1] || null,
        }, { transaction });
        await shop.uploads(data.images);
      }

      if (data.documents?.[0]) {
        await shop.uploads(data.documents, Gallery.SHOP_DOCUMENTS);
      }

      if (data.tags?.length) {
        await shop.setTags(data.tags);
      }

      await transaction.commit();

      if (data.zipcode && data.city && data.locality) {
        const location = await ShopLocation.create({
          shop_id: shop.id,
          zipcode: data.zipcode,
          region_id: 1,
          city_id: 1,
          country_id: 1,
          area_id: 1,
          city: data.city,
          location: data.locality,
        });

        await this.createDelhiveryWarehouse(location, shop);
      }

      const locale = await Language.findOne({ where: { default: true } });
      const response = await Shop.findByPk(shop.id, {
        include: [
          { association: 'translation', where: { locale: [this.language, locale?.locale] }, required: false },
          'subscription',
          { association: 'seller', attributes: ['id', 'firstname', 'lastname', 'uuid'], include: ['roles'] },
          { association: 'tags', include: ['translation'] },
        ]
      });

      return { status: true, code: ResponseError.NO_ERROR, data: response };

    } catch (e) {
      await transaction.rollback();
      this.error(e);
      return { status: false, code: ResponseError.ERROR_501, message: e.message };
    }
  }

  // async createDelhiveryWarehouse(shopLocation, shop) {
  //   const delhivery = new DelhiveryService();
  //   const warehouseData = {
  //     phone: shop.seller.phone,
  //     city: shopLocation.city,
  //     name: `${shop.seller.firstname} ${shop.seller.lastname}`,
  //     pin: shopLocation.zipcode,
  //     address: shopLocation.location,
  //     country: 'India',
  //     email: shop.seller.email,
  //     registered_name: `${shop.seller.firstname} ${shop.seller.lastname}`,
  //     return_address: shopLocation.location,
  //     return_pin: shopLocation.zipcode,
  //     return_city: shopLocation.city,
  //     return_state: shopLocation.state,
  //     return_country: 'India',
  //   };

  //   let response = await delhivery.createWarehouse(warehouseData);

  //   if (!response.success && JSON.stringify(response).includes('already exists')) {
  //     response = await delhivery.editWarehouse({
  //       name: warehouseData.name,
  //       registered_name: warehouseData.registered_name,
  //       address: warehouseData.address
  //     });
  //   }

  //   if (!response.error) {
  //     const data = response.data || {};
  //     await shopLocation.update({
  //       warehouse: response,
  //       warehouse_address: data.address,
  //       warehouse_city: data.address,
  //       warehouse_country: 'India',
  //       warehouse_name: data.name,
  //       warehouse_phone: data.phone,
  //       warehouse_zipcode: data.pincode
  //     });
  //   }

  //   return response;
  // }

  // async update(uuid, data) {
  //   try {
  //     const shop = await Shop.findOne({
  //       where: { uuid, ...(data.user_id ? { user_id: data.user_id } : {}) },
  //       include: ['invitations']
  //     });
  //     if (!shop) return { status: false, code: ResponseError.ERROR_404 };

  //     await shop.update(this.setShopParams(data, shop));

  //     if (data.lat_long?.latitude && data.lat_long?.longitude) {
  //       const geo = await reverseGeocode(data.lat_long.latitude, data.lat_long.longitude);

  //       const location = await ShopLocation.upsert({
  //         shop_id: shop.id,
  //         ...geo,
  //         region_id: 1, city_id: 1, country_id: 1, area_id: 1
  //       });

  //       await this.createDelhiveryWarehouse(location[0], shop);
  //     }

  //     if (shop.delivery_type === Shop.DELIVERY_TYPE_IN_HOUSE) {
  //       await Invitation.destroy({
  //         where: {
  //           shop_id: shop.id,
  //           '$user.roles.name$': 'deliveryman'
  //         },
  //         include: ['user']
  //       });
  //     }

  //     await this.setTranslations(shop, data);

  //     if (data.images?.[0]) {
  //       await shop.galleries().destroy({ where: { type: { [Op.ne]: Gallery.SHOP_GALLERIES } } });
  //       await shop.update({
  //         logo_img: data.images[0],
  //         background_img: data.images[1] || null,
  //       });
  //       await shop.uploads(data.images);
  //     }

  //     if (data.documents?.[0]) {
  //       await shop.uploads(data.documents);
  //     }

  //     if (data.tags?.length) {
  //       await shop.setTags(data.tags);
  //     }

  //     const locale = await Language.findOne({ where: { default: true } });
  //     const response = await Shop.findByPk(shop.id, {
  //       include: ['translation', 'subscription', 'seller.roles', 'tags.translation', 'seller', 'workingDays', 'closedDates']
  //     });

  //     return { status: true, code: ResponseError.NO_ERROR, data: response };

  //   } catch (e) {
  //     this.error(e);
  //     return { status: false, code: ResponseError.ERROR_502, message: e.message };
  //   }
  // }

  // setShopParams(data, shop = null) {
  //   const deliveryTime = shop?.delivery_time || {};
  //   if (data.delivery_time_from) deliveryTime.from = data.delivery_time_from;
  //   if (data.delivery_time_to) deliveryTime.to = data.delivery_time_to;
  //   if (data.delivery_time_type) deliveryTime.type = data.delivery_time_type;
  //   return {
  //     ...data,
  //     delivery_time: deliveryTime,
  //     type: 1,
  //   };
  // }
}

module.exports = new ShopService();
