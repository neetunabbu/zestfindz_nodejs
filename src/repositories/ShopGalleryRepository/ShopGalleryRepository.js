// File: D:/zestfindz_nodejs/src/repositories/ShopGalleryRepository/ShopGalleryRepository.js

const { Op } = require('sequelize');
const { ShopGallery } = require('../../models/ShopGallery');
const { Gallery } = require('../../models/Gallery');
const { getWith } = require('../../traits/ByLocation');
const { CoreRepository } = require('../CoreRepository');

class ShopGalleryRepository {
  constructor() {
    this.model = ShopGallery;
  }

  async show(shopGalleryInstance) {
    return await this.model.findOne({
      where: { id: shopGalleryInstance.id },
      include: [
        {
          model: Gallery,
          as: 'galleries',
        },
      ],
    });
  }
}

module.exports = new ShopGalleryRepository();
