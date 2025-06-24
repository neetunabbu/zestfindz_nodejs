const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Category extends Model {
  static MAIN = 1;
  static SUB_MAIN = 2;
  static CHILD = 3;
  static CAREER = 10;

  static TYPES = {
    main: Category.MAIN,
    sub_main: Category.SUB_MAIN,
    child: Category.CHILD,
    career: Category.CAREER,
  };

  static TYPES_VALUES = {
    [Category.MAIN]: 'main',
    [Category.SUB_MAIN]: 'sub_main',
    [Category.CHILD]: 'child',
    [Category.CAREER]: 'career',
  };

  static PENDING = 'pending';
  static PUBLISHED = 'published';
  static UNPUBLISHED = 'unpublished';

  static STATUSES = {
    [Category.PUBLISHED]: Category.PUBLISHED,
    [Category.PENDING]: Category.PENDING,
    [Category.UNPUBLISHED]: Category.UNPUBLISHED,
  };

  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        uuid: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        keywords: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        parent_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        age_limit: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        type: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        img: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        input: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        shop_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'active' is BOOLEAN, 'type', 'input', 'age_limit' are INTEGER, 'created_at' and 'updated_at' are DATE
      }
    );
  }

  // Traits (to be implemented separately as needed)
  // Loadable: Custom trait for data-loading functionality
  // MetaTagable: Custom trait for meta tag functionality
  // Note: These traits are not implemented here as per "no additions" instruction
  // Implement as separate utilities or include in a base class if needed

  static associate(models) {
    // Relationships
    this.hasMany(models.CategoryTranslation, { foreignKey: 'category_id', as: 'translations' });
    this.hasOne(models.CategoryTranslation, { foreignKey: 'category_id', as: 'translation' });
    this.belongsTo(models.Category, { foreignKey: 'parent_id', as: 'parent' });
    this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    this.hasMany(models.Category, { foreignKey: 'parent_id', as: 'children' });
    this.hasOne(models.Product, { foreignKey: 'category_id', as: 'product' });
    this.hasMany(models.Product, { foreignKey: 'category_id', as: 'products' });
    this.hasMany(models.Stock, {
      through: models.Product,
      foreignKey: 'category_id',
      otherKey: 'product_id',
      as: 'stocks',
    });
    this.hasMany(models.ModelLog, {
      foreignKey: 'model_id',
      constraints: false,
      scope: { model_type: 'App\\Models\\Category' },
      as: 'logs',
    });
  }

  // Replicate Laravel's scopeUpdatedDate
  static updatedDate(query, updatedDate) {
    return query.where({ updated_at: { [Op.gt]: updatedDate } });
  }

  // Replicate Laravel's scopeWithSecondChildren
  static withSecondChildren(query, data) {
    const locale = models.Language.findOne({ where: { default: 1 } })?.locale || 'en';

    return query.include([
      {
        model: models.Shop,
        as: 'shop',
        include: [
          {
            model: models.ShopTranslation,
            as: 'translation',
            attributes: ['id', 'locale', 'title', 'shop_id'],
            where: {
              [Op.or]: [
                { locale: data.lang || locale },
                { locale },
              ],
            },
          },
        ],
      },
      {
        model: models.Category,
        as: 'parent',
        include: [
          {
            model: models.CategoryTranslation,
            as: 'translation',
            attributes: ['id', 'locale', 'title', 'category_id'],
            where: {
              [Op.or]: [
                { locale: data.lang || locale },
                { locale },
              ],
            },
          },
        ],
      },
      {
        model: models.CategoryTranslation,
        as: 'translation',
        attributes: ['id', 'locale', 'title', 'category_id'],
        where: {
          [Op.or]: [
            { locale: data.lang || locale },
            { locale },
          ],
        },
      },
      {
        model: models.Category,
        as: 'children',
        where: {
          [Op.and]: [
            request().is('api/v1/rest/*') ? { active: true, status: Category.PUBLISHED } : {},
            typeof data.active !== 'undefined' ? { active: data.active } : {},
            data.status ? { status: data.status } : {},
            data.statuses ? { status: { [Op.in]: data.statuses } } : {},
          ].filter(Boolean),
        },
        include: [
          {
            model: models.CategoryTranslation,
            as: 'translation',
            attributes: ['id', 'locale', 'title', 'category_id'],
            where: {
              [Op.or]: [
                { locale: data.lang || locale },
                { locale },
              ],
            },
          },
        ],
      },
    ]);
  }

  // Replicate Laravel's scopeWithParent
  static withParent(query, data) {
    const locale = models.Language.findOne({ where: { default: 1 } })?.locale || 'en';

    return query.include([
      {
        model: models.Shop,
        as: 'shop',
        include: [
          {
            model: models.ShopTranslation,
            as: 'translation',
            attributes: ['id', 'locale', 'title', 'shop_id'],
            where: {
              [Op.or]: [
                { locale: data.lang || locale },
                { locale },
              ],
            },
          },
        ],
      },
      {
        model: models.CategoryTranslation,
        as: 'translation',
        attributes: ['id', 'locale', 'title', 'category_id'],
        where: {
          [Op.or]: [
            { locale: data.lang || locale },
            { locale },
          ],
        },
      },
      {
        model: models.Category,
        as: 'parent',
        where: {
          [Op.and]: [
            request().is('api/v1/rest/*') ? { active: true, status: Category.PUBLISHED } : {},
            typeof data.active !== 'undefined' ? { active: data.active } : {},
            data.status ? { status: data.status } : {},
            data.statuses ? { status: { [Op.in]: data.statuses } } : {},
          ].filter(Boolean),
        },
        include: [
          {
            model: models.CategoryTranslation,
            as: 'translation',
            attributes: ['id', 'locale', 'title', 'category_id'],
            where: {
              [Op.or]: [
                { locale: data.lang || locale },
                { locale },
              ],
            },
          },
        ],
      },
    ]);
  }

  // Replicate Laravel's scopeWithThreeChildren
  static withThreeChildren(query, data) {
    const locale = models.Language.findOne({ where: { default: 1 } })?.locale || 'en';

    return query.include([
      {
        model: models.Shop,
        as: 'shop',
        include: [
          {
            model: models.ShopTranslation,
            as: 'translation',
            attributes: ['id', 'locale', 'title', 'shop_id'],
            where: {
              [Op.or]: [
                { locale: data.lang || locale },
                { locale },
              ],
            },
          },
        ],
      },
      {
        model: models.Category,
        as: 'parent',
        include: [
          {
            model: models.CategoryTranslation,
            as: 'translation',
            attributes: ['id', 'locale', 'title', 'category_id'],
            where: {
              [Op.or]: [
                { locale: data.lang || locale },
                { locale },
              ],
            },
          },
        ],
      },
      {
        model: models.CategoryTranslation,
        as: 'translation',
        where: {
          [Op.or]: [
            { locale: data.lang || locale },
            { locale },
          ],
        },
      },
      {
        model: models.Category,
        as: 'children',
        where: {
          [Op.and]: [
            request().is('api/v1/rest/*') ? { active: true, status: Category.PUBLISHED } : {},
            typeof data.active !== 'undefined' ? { active: data.active } : {},
            data.status ? { status: data.status } : {},
            data.statuses ? { status: { [Op.in]: data.statuses } } : {},
          ].filter(Boolean),
        },
        include: [
          {
            model: models.CategoryTranslation,
            as: 'translation',
            attributes: ['id', 'locale', 'title', 'category_id'],
            where: {
              [Op.or]: [
                { locale: data.lang || locale },
                { locale },
              ],
            },
          },
          {
            model: models.Category,
            as: 'children',
            where: {
              [Op.and]: [
                request().is('api/v1/rest/*') ? { active: true, status: Category.PUBLISHED } : {},
                typeof data.active !== 'undefined' ? { active: data.active } : {},
                data.status ? { status: data.status } : {},
                data.statuses ? { status: { [Op.in]: data.statuses } } : {},
              ].filter(Boolean),
            },
            include: [
              {
                model: models.CategoryTranslation,
                as: 'translation',
                attributes: ['id', 'locale', 'title', 'category_id'],
                where: {
                  [Op.or]: [
                    { locale: data.lang || locale },
                    { locale },
                  ],
                },
              },
              {
                model: models.Category,
                as: 'children',
                where: {
                  [Op.and]: [
                    request().is('api/v1/rest/*') ? { active: true, status: Category.PUBLISHED } : {},
                    typeof data.active !== 'undefined' ? { active: data.active } : {},
                    data.status ? { status: data.status } : {},
                    data.statuses ? { status: { [Op.in]: data.statuses } } : {},
                  ].filter(Boolean),
                },
                include: [
                  {
                    model: models.CategoryTranslation,
                    as: 'translation',
                    attributes: ['id', 'locale', 'title', 'category_id'],
                    where: {
                      [Op.or]: [
                        { locale: data.lang || locale },
                        { locale },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  }

  // Replicate Laravel's scopeFilter
  static filter(query, filter) {
    const isApiRoute = request().is('api/v1/rest/*');

    query
      .when(isApiRoute, (q) => q.where({ active: true, status: Category.PUBLISHED }))
      .when(!isApiRoute && filter.status, (q) => q.where({ status: filter.status }))
      .when(filter.slug, (q, slug) => q.where({ slug }))
      .when(Object.keys(Category.TYPES).includes(filter.type), (q) => q.where({
        type: Category.TYPES[filter.type] || Category.MAIN,
      }))
      .when(typeof filter.active !== 'undefined', (q) => q.where({ active: filter.active }))
      .when(filter.parent_id, (q, parentId) => q.where({ parent_id: parentId }))
      .when(filter.parent_ids, (q, parentIds) => q.where({ parent_id: { [Op.in]: parentIds } }))
      .when(filter.statuses, (q, statuses) => q.where({ status: { [Op.in]: statuses } }))
      .when(typeof filter.shop_id !== 'undefined', (q) => q.where({
        [Op.or]: [
          { shop_id: filter.shop_id },
          filter.is_admin ? {} : { shop_id: null },
        ].filter(Boolean),
      }))
      .when(filter.has_products || filter.product_shop_id, (q) => q.where({
        [Op.or]: [
          filter.type === Category.TYPES_VALUES[Category.MAIN] ? {
            [Op.or]: [
              { '$product.status$': 'published', '$product.active$': true, ...(filter.product_shop_id ? { '$product.shop_id$': filter.product_shop_id } : {}) },
              { '$children.product.status$': 'published', '$children.product.active$': true, ...(filter.product_shop_id ? { '$children.product.shop_id$': filter.product_shop_id } : {}) },
              { '$children.children.product.status$': 'published', '$children.children.product.active$': true, ...(filter.product_shop_id ? { '$children.children.product.shop_id$': filter.product_shop_id } : {}) },
            ],
          } : {},
          filter.type === Category.TYPES_VALUES[Category.SUB_MAIN] ? {
            [Op.or]: [
              { '$product.status$': 'published', '$product.active$': true, ...(filter.product_shop_id ? { '$product.shop_id$': filter.product_shop_id } : {}) },
              { '$children.product.status$': 'published', '$children.product.active$': true, ...(filter.product_shop_id ? { '$children.product.shop_id$': filter.product_shop_id } : {}) },
            ],
          } : {},
          filter.type === Category.TYPES_VALUES[Category.CHILD] ? {
            '$product.status$': 'published',
            '$product.active$': true,
            ...(filter.product_shop_id ? { '$product.shop_id$': filter.product_shop_id } : {}),
          } : {},
        ].filter(Boolean),
      }, {
        include: [
          { model: models.Product, as: 'product' },
          {
            model: models.Category,
            as: 'children',
            include: [
              { model: models.Product, as: 'product' },
              {
                model: models.Category,
                as: 'children',
                include: [{ model: models.Product, as: 'product' }],
              },
            ],
          },
        ],
      }))
      .when(filter.search, (q, search) => q.where({
        [Op.or]: [
          { keywords: { [Op.like]: `%${search}%` } },
          { '$translation.title$': { [Op.like]: `%${search}%` } },
          { '$translation.keywords$': { [Op.like]: `%${search}%` } },
          { '$children.translation.title$': { [Op.like]: `%${search}%` } },
          { '$children.translation.keywords$': { [Op.like]: `%${search}%` } },
          { '$children.children.translation.title$': { [Op.like]: `%${search}%` } },
          { '$children.children.translation.keywords$': { [Op.like]: `%${search}%` } },
        ],
      }, {
        include: [
          { model: models.CategoryTranslation, as: 'translation' },
          {
            model: models.Category,
            as: 'children',
            include: [
              { model: models.CategoryTranslation, as: 'translation' },
              {
                model: models.Category,
                as: 'children',
                include: [{ model: models.CategoryTranslation, as: 'translation' }],
              },
            ],
          },
        ],
      }))
      .when(filter.age_from, (q) => q.where({
        age_limit: {
          [Op.gte]: filter.age_from,
          [Op.lte]: filter.age_to || 1000000,
        },
      }))
      .when(filter.age_limit, (q, ageLimit) => q.where({ age_limit: ageLimit }));

    return query;
  }
}

// Initialize the model
Category.init();

module.exports = Category;