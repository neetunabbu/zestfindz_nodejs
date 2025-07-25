// D:\zestfindz_nodejs\src\repositories\RequestModelRepository\RequestModelRepository.js

const { Op } = require('sequelize');
const { RequestModel } = require('../../models/RequestModel');
const { Product } = require('../../models/Product');
const { Category } = require('../../models/Category');
const { Language } = require('../../models/Language');
const { CoreRepository } = require('../CoreRepository');

class RequestModelRepository extends CoreRepository {
  constructor(language = 'en') {
    super();
    this.language = language;
  }

  getModelClass() {
    return RequestModel;
  }

  async index(filter = {}) {
    const column = filter.column || 'id';
    const sort = filter.sort || 'desc';
    const perPage = filter.perPage || 10;
    const type = filter.type || 'category';

    const withOptions = await this.getWithByType(type);

    const result = await paginate(RequestModel.scope({ method: ['filter', filter] }), {
      include: withOptions,
      order: [[column, sort]],
      limit: perPage,
    });

    return result;
  }

  async show(requestModel) {
    const withOptions = await this.getOneWithByType(requestModel);
    return requestModel.reload({ include: withOptions });
  }

  async getOneWithByType(requestModel) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;
    let withOptions = [
      { association: 'model' },
      { association: 'createdBy' }
    ];

    if (requestModel.model_type === 'Product') {
      withOptions = [
        {
          association: 'model',
          include: [
            {
              association: 'galleries',
              attributes: ['id', 'type', 'loadable_id', 'path', 'title', 'preview'],
            },
            {
              association: 'properties',
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale },
                ]
              },
              required: false,
            },
            {
              association: 'stocks',
              include: [
                {
                  association: 'stockExtras',
                  include: {
                    association: 'group',
                    include: {
                      association: 'translation',
                      where: {
                        [Op.or]: [
                          { locale: this.language },
                          { locale: locale },
                        ]
                      },
                      required: false
                    }
                  }
                },
                {
                  association: 'addons',
                  include: [
                    {
                      association: 'addon',
                      where: {
                        active: true,
                        addon: true,
                        status: 'published'
                      },
                      include: [
                        'stock',
                        {
                          association: 'translation',
                          where: {
                            [Op.or]: [
                              { locale: this.language },
                              { locale: locale },
                            ]
                          },
                          required: false
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              association: 'discounts',
              where: {
                start: { [Op.lte]: new Date() },
                end: { [Op.gte]: new Date() },
                active: true
              },
              required: false
            },
            {
              association: 'shop',
              include: {
                association: 'translation',
                where: {
                  [Op.or]: [
                    { locale: this.language },
                    { locale: locale },
                  ]
                },
                required: false
              }
            },
            {
              association: 'category',
              attributes: ['id', 'uuid'],
              include: {
                association: 'translation',
                attributes: ['id', 'category_id', 'locale', 'title'],
                where: {
                  [Op.or]: [
                    { locale: this.language },
                    { locale: locale },
                  ]
                },
                required: false
              }
            },
            {
              association: 'brand',
              attributes: ['id', 'uuid', 'title']
            },
            {
              association: 'unit',
              include: {
                association: 'translation',
                where: {
                  [Op.or]: [
                    { locale: this.language },
                    { locale: locale },
                  ]
                },
                required: false
              }
            },
            {
              association: 'reviews',
              include: ['galleries', 'user']
            },
            {
              association: 'translation',
              where: {
                [Op.or]: [
                  { locale: this.language },
                  { locale: locale },
                ]
              },
              required: false
            },
            {
              association: 'tags',
              include: {
                association: 'translation',
                attributes: ['id', 'category_id', 'locale', 'title'],
                where: {
                  [Op.or]: [
                    { locale: this.language },
                    { locale: locale },
                  ]
                },
                required: false
              }
            }
          ]
        },
        { association: 'createdBy' }
      ];
    } else if (requestModel.model_type === 'Category') {
      withOptions = [
        {
          association: 'model',
          include: {
            association: 'translation',
            where: {
              [Op.or]: [
                { locale: this.language },
                { locale: locale },
              ]
            },
            required: false
          }
        },
        { association: 'createdBy' }
      ];
    }

    return withOptions;
  }

  async getWithByType(type = null) {
    const locale = (await Language.findOne({ where: { default: true } }))?.locale;
    let withOptions = [
      { association: 'model' },
      { association: 'createdBy' },
    ];

    if (['category', 'product'].includes(type)) {
      withOptions = [
        {
          association: 'model',
          include: {
            association: 'translation',
            where: {
              [Op.or]: [
                { locale: this.language },
                { locale: locale },
              ]
            },
            required: false
          }
        },
        { association: 'createdBy' },
      ];
    }

    return withOptions;
  }
}

module.exports = RequestModelRepository;
