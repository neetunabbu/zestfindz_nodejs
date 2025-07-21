// File: D:/zestfindz_nodejs/src/repositories/CategoryRepository/CategoryRepository.js

const { Op } = require('sequelize');
const { URL } = require('url');
const Excel = require('exceljs');
const { randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');
const Category = require('../../models/Category');
const Currency = require('../../models/Currency');
const Language = require('../../models/Language');
const Product = require('../../models/Product');
const Stock = require('../../models/Stock');
const CoreRepository = require('../CoreRepository');
const logger = require('../../utils/logger');

// ✅ Equivalent of: use App\Exports\CategoryReportExport;
const CategoryReportExport = require('../../exports/CategoryReportExport');

class CategoryRepository extends CoreRepository {
  constructor(language = null, currency = null) {
    super();
    this.language = language || 'en';
    this.currency = currency;
  }

  async categories(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return Category.scope({ method: ['filter', filter] })
      .findAndCountAll({
        include: [
          'translations',
          {
            association: 'translation',
            attributes: ['id', 'locale', 'title', 'category_id'],
            where: {
              [Op.or]: [
                { locale: this.language },
                { locale }
              ]
            },
            required: false
          },
          {
            association: 'shop',
            include: [
              {
                association: 'translation',
                attributes: ['id', 'locale', 'title', 'shop_id'],
                where: {
                  [Op.or]: [
                    { locale: this.language },
                    { locale }
                  ]
                },
                required: false
              }
            ]
          }
        ],
        order: [[filter.column || 'id', filter.sort || 'desc']],
        limit: filter.perPage || 10,
        offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
      });
  }

  async parentCategories(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return Category.scope({ method: ['filter', filter] })
      .findAndCountAll({
        where: {
          [Op.or]: [
            { parent_id: null },
            { parent_id: 0 }
          ]
        },
        include: [
          'translations',
          {
            association: 'shop',
            include: [
              {
                association: 'translation',
                attributes: ['id', 'locale', 'title', 'shop_id'],
                where: {
                  [Op.or]: [
                    { locale: this.language },
                    { locale }
                  ]
                },
                required: false
              }
            ]
          }
        ],
        order: [[filter.column || 'id', filter.sort || 'desc']],
        limit: filter.perPage || 10,
        offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
      });
  }

  async childrenCategory(id) {
    return Category.findByPk(id, {
      include: [
        {
          association: 'children',
          include: ['children']
        }
      ]
    });
  }

  async selectPaginate(filter = {}) {
    return Category.scope({ method: ['filter', filter] })
      .findAndCountAll({
        attributes: ['id', 'parent_id', 'keywords', 'type', 'active', 'input', 'age_limit'],
        order: [[filter.column || 'id', filter.sort || 'desc']],
        limit: filter.perPage || 10,
        offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
      });
  }

  async mySelectPaginate(filter = {}) {
    return Category.scope({ method: ['filter', filter] })
      .findAndCountAll({
        attributes: ['id', 'parent_id', 'keywords', 'type', 'active', 'input', 'age_limit'],
        include: ['parent'],
        order: [[filter.column || 'id', filter.sort || 'desc']],
        limit: filter.perPage || 10,
        offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
      });
  }

  async categoryByUuid(uuid) {
    return Category.findOne({
      where: { uuid },
      include: ['children', 'products']
    });
  }

  async categoryBySlug(slug) {
    return Category.findOne({
      where: { slug },
      include: ['children']
    });
  }

  async categoriesSearch(filter = {}) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;

    return Category.scope({ method: ['filter', filter] })
      .findAndCountAll({
        include: [
          {
            association: 'shop',
            include: [
              {
                association: 'translation',
                attributes: ['id', 'locale', 'title', 'shop_id'],
                where: {
                  [Op.or]: [
                    { locale: this.language },
                    { locale }
                  ]
                },
                required: false
              }
            ]
          },
          {
            association: 'translation',
            attributes: ['id', 'locale', 'title', 'category_id'],
            where: {
              [Op.or]: [
                { locale: this.language },
                { locale }
              ]
            },
            required: false
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: filter.perPage || 10,
        offset: ((filter.page || 1) - 1) * (filter.perPage || 10)
      });
  }
}

module.exports = new CategoryRepository();
