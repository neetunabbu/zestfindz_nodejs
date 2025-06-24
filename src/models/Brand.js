const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Brand extends Model {
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
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        img: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        shop_id: {
          type: DataTypes.STRING,
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
        modelName: 'Brand',
        tableName: 'brands',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'active' is already BOOLEAN, no additional casting needed
      }
    );
  }

  // Traits (to be implemented separately as needed)
  // Loadable: Custom trait for loading-related functionality
  // MetaTagable: Custom trait for meta tag-related functionality
  // Note: These traits are not implemented here as per "no additions" instruction
  // Implement these as separate utilities or include in a base class if needed

  static associate(models) {
    // Relationships
    this.hasMany(models.Product, { foreignKey: 'brand_id', as: 'products' });
    this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    this.hasMany(models.ModelLog, {
      foreignKey: 'model_id',
      constraints: false,
      scope: {
        model_type: 'App\\Models\\Brand',
      },
      as: 'logs',
    });
  }

  // Replicate Laravel's scopeUpdatedDate
  static updatedDate(query, updatedDate) {
    return query.where({
      updated_at: { [Op.gt]: updatedDate },
    });
  }

  // Replicate Laravel's scopeFilter
  static filter(query, filter) {
    query
      .when(filter.search, (q, search) => q.where({
        title: { [Op.like]: `%${search}%` },
      }))
      .when(filter.slug, (q, slug) => q.where({ slug }))
      .when(filter.shop_id, (q, shopId) => q.where({
        [Op.or]: [
          { shop_id: shopId },
          ...(filter.is_admin === undefined ? [{ shop_id: null }] : []),
        ],
      }))
      .when(filter.active !== undefined, (q) => q.where({ active: filter.active }))
      .when(filter.category_id, (q, categoryId) => q.where({
        '$products.category_id$': categoryId,
        '$products.active$': true,
        '$products.status$': 'published', // Assumes Product.PUBLISHED = 'published'
        '$products.stocks.quantity$': { [Op.gt]: 0 },
      }, {
        include: [{
          model: this.sequelize.models.Product,
          as: 'products',
          include: [{
            model: this.sequelize.models.Stock,
            as: 'stocks',
          }],
        }],
      }))
      .when(filter.column, (q, column) => q.order([
        [column, filter.sort || 'desc'],
      ]), (q) => q.order([['id', 'desc']]));

    return query;
  }
}

// Initialize the model
Brand.init();

module.exports = Brand;