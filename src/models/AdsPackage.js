const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class AdsPackage extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        position_page: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        time_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        time: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        product_limit: {
          type: DataTypes.DOUBLE,
          allowNull: false,
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
        modelName: 'AdsPackage',
        tableName: 'ads_packages',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'active' is already BOOLEAN, no additional casting needed
      }
    );
  }

  // Constants
  static MAIN = 'main';
  static STANDARD = 'standard';
  static MAIN_TOP_BANNER = 'main_top_banner';
  static MAIN_BANNER = 'main_banner';
  static MAIN_LEFT_BANNER = 'main_left_banner';
  static MAIN_RIGHT_BANNER = 'main_right_banner';
  static STANDARD_TOP_BANNER = 'standard_top_banner';

  static MINUTE = 'minute';
  static HOUR = 'hour';
  static DAY = 'day';
  static WEEK = 'week';
  static MONTH = 'month';
  static YEAR = 'year';

  static TYPES = {
    [this.MAIN]: this.MAIN,
    [this.STANDARD]: this.STANDARD,
    [this.MAIN_TOP_BANNER]: this.MAIN_TOP_BANNER,
    [this.MAIN_BANNER]: this.MAIN_BANNER,
    [this.MAIN_LEFT_BANNER]: this.MAIN_LEFT_BANNER,
    [this.MAIN_RIGHT_BANNER]: this.MAIN_RIGHT_BANNER,
    [this.STANDARD_TOP_BANNER]: this.STANDARD_TOP_BANNER,
  };

  static PRODUCT_TYPES = {
    [this.MAIN]: this.MAIN,
    [this.STANDARD]: this.STANDARD,
  };

  static TIME_TYPES = {
    [this.MINUTE]: this.MINUTE,
    [this.HOUR]: this.HOUR,
    [this.DAY]: this.DAY,
    [this.WEEK]: this.WEEK,
    [this.MONTH]: this.MONTH,
    [this.YEAR]: this.YEAR,
  };

  // Traits (to be implemented separately as needed)
  // SetCurrency: Custom trait for currency handling
  // Loadable: Custom trait for loading-related functionality
  // ByLocation: Custom trait for location-based filtering
  // Note: These traits are not implemented here as per "no additions" instruction
  // Implement these as separate utilities or include in a base class if needed

  static associate(models) {
    // Relationships
    this.hasMany(models.AdsPackageTranslation, { foreignKey: 'ads_package_id', as: 'translations' });
    this.hasOne(models.AdsPackageTranslation, { foreignKey: 'ads_package_id', as: 'translation' });
    this.hasMany(models.ShopAdsPackage, { foreignKey: 'ads_package_id', as: 'shopAdsPackages' });
  }

  // Scopes
  static active(query) {
    return query.where({ active: true });
  }

  static async filter(query, filter) {
    // Simulate Laravel's request() function (assumes a global request object or filter params)
    // In a real app, pass request data explicitly or use a middleware
    const regionId = filter.region_id || null;
    const countryId = filter.country_id || null;
    const cityId = filter.city_id || null;
    const areaId = filter.area_id || null;
    const byLocation = regionId || countryId || cityId || areaId;

    // Note: getShopIds method from ByLocation trait needs to be implemented separately
    // Placeholder: Assume it returns an array of shop IDs based on location filters
    const getShopIds = (filter) => {
      // Implement ByLocation::getShopIds logic here
      // Example: return models.Shop.findAll({ where: { region_id, country_id, city_id, area_id } }).map(shop => shop.id);
      throw new Error('getShopIds from ByLocation trait must be implemented');
    };

    query = query
      .when(filter.active !== undefined, (q) => q.where({ active: filter.active }))
      .when(filter.type, (q, type) => q.where({ type }))
      .when(filter.position_page, (q, positionPage) => q.where({ position_page: positionPage }))
      .when(filter.time_type, (q, timeType) => q.where({ time_type: timeType }))
      .when(filter.time, (q, time) => q.where({ time }))
      .when(byLocation, (q) =>
        q.where({
          '$shopAdsPackages.shop_id$': { [Op.in]: getShopIds(filter) },
        }, {
          include: [{ model: this.sequelize.models.ShopAdsPackage, as: 'shopAdsPackages' }],
        })
      )
      .when(filter.search, (q, search) =>
        q.where({
          '$translations.title$': { [Op.like]: `%${search}%` },
        }, {
          include: [{
            model: this.sequelize.models.AdsPackageTranslation,
            as: 'translations',
            attributes: ['id', 'ads_package_id', 'locale', 'title'],
          }],
        })
      )
      .when(filter.price_from, (q, priceFrom) =>
        q.where({
          price: {
            [Op.gte]: priceFrom,
            [Op.lte]: filter.price_to || 100000000,
          },
        })
      )
      .when(filter.limit_from, (q, limitFrom) =>
        q.where({
          product_limit: {
            [Op.gte]: limitFrom,
            [Op.lte]: filter.limitTo || 1000000000,
          },
        })
      )
      .when(filter.column, (q, column) =>
        q.order([[column, filter.sort || 'desc']])
      );

    return query;
  }
}

// Initialize the model
AdsPackage.init();

module.exports = AdsPackage;