// File: src/services/BrandService/BrandService.js
const { Op } = require('sequelize');
const CoreService = require('../CoreService');
const { Brand } = require('../../models/Brand');
const ResponseError = require('../../helpers/ResponseError');
const db = require('../../config/db');
const { slugify } = require('../../helpers/slugify');

class BrandService extends CoreService {
  constructor(language) {
    super();
    this.language = language;
  }

  getModelClass() {
    return Brand;
  }

  async setSlug(data) {
    const count = await db.Brand.count({ where: { title: data.title } });
    return `${slugify(data.title, this.language)}-${count}`;
  }

  async create(data) {
    try {
      try {
        data.slug = await this.setSlug(data);
      } catch (e) {}

      const brand = await this.model().create(data);

      if (data.meta) {
        await brand.setMetaTags(data);
      }

      if (data.images?.[0]) {
        await brand.update({ img: data.images[0] });
        await brand.uploads(data.images);
      }

      return { status: true, code: ResponseError.NO_ERROR, data: brand };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501,
        message: this.translate(`errors.${ResponseError.ERROR_501}`)
      };
    }
  }

  async update(brand, data) {
    try {
      if (data.title !== brand.title) {
        try {
          data.slug = await this.setSlug(data);
        } catch (e) {}
      }

      await brand.update(data);

      if (data.meta) {
        await brand.setMetaTags(data);
      }

      if (data.images?.[0]) {
        await brand.galleries().destroy();
        await brand.update({ img: data.images[0] });
        await brand.uploads(data.images);
      }

      return { status: true, code: ResponseError.NO_ERROR, data: brand };
    } catch (e) {
      this.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_502,
        message: this.translate(`errors.${ResponseError.ERROR_502}`)
      };
    }
  }

  async delete(ids = [], shopId = null) {
    let hasProducts = 0;

    const brands = await this.model().findAll({
      where: {
        id: ids,
        ...(shopId ? { shop_id: shopId } : {})
      },
      include: ['products']
    });

    for (const brand of brands) {
      if (brand.products?.length > 0) {
        hasProducts++;
        continue;
      }

      await brand.destroy();
    }

    return {
      status: true,
      code: ResponseError.ERROR_507,
      message: this.translate(`errors.${ResponseError.ERROR_507}`),
      ...(hasProducts ? { data: hasProducts } : {})
    };
  }
}

module.exports = BrandService;
