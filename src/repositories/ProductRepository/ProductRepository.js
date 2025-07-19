// File: D:/zestfindz_nodejs/src/repositories/ProductRepository/ProductRepository.js

const { Op } = require('sequelize');

const Product = require('../../models/Product');
const ProductTranslation = require('../../models/ProductTranslation');
const Category = require('../../models/Category');
const CategoryTranslation = require('../../models/CategoryTranslation');
const Gallery = require('../../models/Gallery');
const Shop = require('../../models/Shop');
const Language = require('../../models/Language');
const Unit = require('../../models/Unit');
const Bonus = require('../../models/Bonus');
const Review = require('../../models/Review');
const User = require('../../models/User');
const Like = require('../../models/Like');
const ProductExtra = require('../../models/ProductExtra');
const ProductProperties = require('../../models/ProductProperties');
const ProductPropertyValue = require('../../models/ProductPropertyValue');
const ProductAddon = require('../../models/ProductAddon');
const Stock = require('../../models/Stock');
const Coupon = require('../../models/Coupon');
const OrderDetail = require('../../models/OrderDetail');
const ProductReport = require('../../models/ProductReport');
const Notification = require('../../models/Notification');
const DeliveryZone = require('../../models/DeliveryZone');
const DeliveryTranslation = require('../../models/DeliveryTranslation');
const Delivery = require('../../models/Delivery');
const Country = require('../../models/Country');
const Currency = require('../../models/Currency');

const RestProductRepository = require('../ProductRepository/RestProductRepository');
const { getShopIdsFromFilter } = require('../../../helpers/locationHelper');
const { paginate } = require('../../../helpers/pagination');
const fs = require('fs');
const path = require('path');
const { Op: SequelizeOp } = require('sequelize');
const CoreRepository = require('../CoreRepository');

const ProductRepository = {

  async productDetails(id, lang = 'en') {
    return await Product.findOne({
      where: { id },
      include: [
        {
          model: ProductTranslation,
          as: 'translation',
          where: { locale: lang },
          required: false
        },
        {
          model: DigitalFile,
          as: 'digitalFile'
        },
        {
          model: Shop,
          as: 'shop',
          include: [
            {
              association: 'translation',
              where: { locale: lang },
              required: false
            }
          ]
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'uuid'],
          include: [
            {
              model: CategoryTranslation,
              as: 'translation',
              where: { locale: lang },
              required: false
            }
          ]
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'uuid', 'title']
        },
        {
          model: Unit,
          as: 'unit',
          include: [
            {
              model: UnitTranslation,
              as: 'translation',
              where: { locale: lang },
              required: false
            }
          ]
        },
        {
          model: Tag,
          as: 'tags',
          include: [
            {
              model: TagTranslation,
              as: 'translation',
              where: { locale: lang },
              required: false
            }
          ]
        },
        {
          model: Gallery,
          as: 'galleries',
          attributes: ['id', 'type', 'loadable_id', 'path', 'title', 'preview']
        },
        {
          model: Property,
          as: 'properties',
          include: [
            {
              model: PropertyValue,
              as: 'value'
            },
            {
              model: PropertyGroup,
              as: 'group',
              include: [
                {
                  model: PropertyGroupTranslation,
                  as: 'translation',
                  where: { locale: lang },
                  required: false
                }
              ]
            }
          ]
        },
        {
          model: Stock,
          as: 'stocks',
          include: [
            {
              model: Gallery,
              as: 'galleries'
            },
            {
              model: StockExtra,
              as: 'stockExtras',
              include: [
                {
                  model: StockExtraValue,
                  as: 'value'
                },
                {
                  model: StockExtraGroup,
                  as: 'group',
                  include: [
                    {
                      model: StockExtraGroupTranslation,
                      as: 'translation',
                      where: { locale: lang },
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
  },

  async productByUUID(uuid, lang = 'en') {
    return await Product.findOne({
      where: { uuid },
      include: [
        {
          model: ProductTranslation,
          as: 'translation',
          where: { locale: lang },
          required: false
        },
        {
          model: DigitalFile,
          as: 'digitalFile'
        },
        {
          model: Shop,
          as: 'shop',
          include: [
            {
              association: 'translation',
              where: { locale: lang },
              required: false
            }
          ]
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'uuid'],
          include: [
            {
              model: CategoryTranslation,
              as: 'translation',
              where: { locale: lang },
              required: false
            }
          ]
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'uuid', 'title']
        },
        {
          model: Unit,
          as: 'unit',
          include: [
            {
              model: UnitTranslation,
              as: 'translation',
              where: { locale: lang },
              required: false
            }
          ]
        },
        {
          model: Tag,
          as: 'tags',
          include: [
            {
              model: TagTranslation,
              as: 'translation',
              where: { locale: lang },
              required: false
            }
          ]
        },
        {
          model: Gallery,
          as: 'galleries',
          attributes: ['id', 'type', 'loadable_id', 'path', 'title', 'preview']
        },
        {
          model: Property,
          as: 'properties',
          include: [
            {
              model: PropertyValue,
              as: 'value'
            },
            {
              model: PropertyGroup,
              as: 'group',
              include: [
                {
                  model: PropertyGroupTranslation,
                  as: 'translation',
                  where: { locale: lang },
                  required: false
                }
              ]
            }
          ]
        },
        {
          model: Stock,
          as: 'stocks',
          include: [
            {
              model: Gallery,
              as: 'galleries'
            },
            {
              model: StockExtra,
              as: 'stockExtras',
              include: [
                {
                  model: StockExtraValue,
                  as: 'value'
                },
                {
                  model: StockExtraGroup,
                  as: 'group',
                  include: [
                    {
                      model: StockExtraGroupTranslation,
                      as: 'translation',
                      where: { locale: lang },
                      required: false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
  }
};

module.exports = ProductRepository;

