// File: D:/zestfindz_nodejs/src/repositories/StoryRepository/StoryRepository.js

const { Op } = require('sequelize');
const { Story } = require('../../models/Story');
const { Shop } = require('../../models/Shop');
const { Product } = require('../../models/Product');
const { Language } = require('../../models/Language');
const { CoreRepository } = require('../CoreRepository');

class StoryRepository extends CoreRepository {
  constructor() {
    super();
    this.model = Story;
  }

  async index(data = {}, type = 'paginate', language) {
    const perPage = parseInt(data.perPage) || 15;
    const page = parseInt(data.page) || 1;
    const offset = (page - 1) * perPage;

    const method = {
      paginate: async () => {
        const result = await Story.findAndCountAll({
          where: {
            ...(data.shop_id && { shop_id: data.shop_id }),
            ...(data.product_id && { product_id: data.product_id }),
            ...(typeof data.active !== 'undefined' && { active: data.active }),
          },
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'uuid'],
              include: [
                {
                  association: 'translation',
                  where: { locale: language },
                  attributes: ['id', 'product_id', 'locale', 'title']
                }
              ]
            },
            {
              model: Shop,
              as: 'shop',
              attributes: ['id', 'uuid', 'user_id', 'logo_img'],
              include: [
                {
                  association: 'translation',
                  where: { locale: language },
                  attributes: ['id', 'shop_id', 'locale', 'title']
                }
              ]
            }
          ],
          attributes: ['id', 'product_id', 'shop_id', 'active', 'file_urls'],
          order: [[data.column || 'id', data.sort || 'desc']],
          limit: perPage,
          offset,
        });

        return {
          data: result.rows,
          total: result.count,
          perPage,
          currentPage: page,
          lastPage: Math.ceil(result.count / perPage),
        };
      },

      simplePaginate: async () => {
        const result = await Story.findAll({
          limit: perPage,
          offset,
        });

        return result;
      }
    };

    return await (method[type] || method.paginate)();
  }

  async list(data = {}, language) {
    const localeObj = await Language.findOne({ where: { default: true } });
    const locale = localeObj?.locale || 'en';

    const results = await Story.findAll({
      where: {
        created_at: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
      include: [
        {
          model: Shop,
          as: 'shop',
          attributes: ['id', 'uuid', 'logo_img'],
          include: [
            {
              association: 'seller',
              attributes: ['id', 'firstname', 'lastname', 'img']
            },
            {
              association: 'translation',
              where: {
                locale: { [Op.or]: [language, locale] },
              },
              attributes: ['id', 'shop_id', 'locale', 'title']
            },
          ],
        },
        {
          model: Product,
          as: 'product',
          where: {
            active: 1,
            status: Product.PUBLISHED,
          },
          required: false,
          include: [
            {
              association: 'translation',
              where: {
                locale: { [Op.or]: [language, locale] },
              },
              attributes: ['id', 'product_id', 'locale', 'title']
            },
            ...(data.free ? [{
              association: 'stock',
              where: { price: 0 },
              required: true,
            }] : [])
          ],
        },
      ]
    });

    const shops = {};
    for (const item of results) {
      const shopId = item.shop_id;
      if (!item.product || !item.product.active || item.product.status !== Product.PUBLISHED) continue;

      if (!shops[shopId]) shops[shopId] = [];

      for (const fileUrl of item.file_urls || []) {
        shops[shopId].push({
          shop_id: item.shop_id,
          shop_uuid: item.shop?.uuid,
          logo_img: item.shop?.logo_img,
          title: item.shop?.translation?.title,
          firstname: item.shop?.seller?.firstname,
          lastname: item.shop?.seller?.lastname,
          avatar: item.shop?.seller?.img,
          product_uuid: item.product?.uuid,
          product_title: item.product?.translation?.title,
          url: fileUrl,
          created_at: item.created_at?.toISOString(),
          updated_at: item.updated_at?.toISOString(),
        });
      }
    }

    return Object.values(shops).filter(arr => arr.length > 0);
  }

  async show(id, language) {
    const localeObj = await Language.findOne({ where: { default: true } });
    const locale = localeObj?.locale || 'en';

    return await Story.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product',
          include: [{
            association: 'translation',
            where: { locale: { [Op.or]: [language, locale] } }
          }]
        },
        {
          model: Shop,
          as: 'shop',
          include: [{
            association: 'translation',
            where: { locale: { [Op.or]: [language, locale] } },
            attributes: ['id', 'shop_id', 'locale', 'title']
          }]
        }
      ]
    });
  }
}

module.exports = new StoryRepository();
