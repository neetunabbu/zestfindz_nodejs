const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL database connection (PostgreSQL connection)

class Country extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        region_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
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
      },
      {
        sequelize,
        modelName: 'Country',
        tableName: 'countries',
        timestamps: false,
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Laravel's Sequelize doesn't have a direct "guarded" equivalent, but all fields except 'id' are
// mass-assignable
        // Casts: 'active' is BOOLEAN
      }
    );
  }

  // Traits (to be implemented separately as needed)
  // Loadable: Custom trait for data-loading functionality
  // Regions: Custom trait for region-related functionality
  // Note: These traits are not implemented here as per "no additions" instruction
  // Implement as separate utilities or include in a base class if needed

  static associate(models) {
    // Relationships
    this.hasMany(models.CountryTranslation, { foreignKey: 'country_id', as: 'translations' });
    this.hasOne(models.CountryTranslation, { foreignKey: 'country_id', as: 'translation' });
    this.hasOne(models.City, { foreignKey: 'country_id', as: 'city' });
    this.hasMany(models.City, { foreignKey: 'country_id', as: 'cities' });
    this.hasOne(models.Area, { foreignKey: 'country_id', as: 'area' });
    this.hasMany(models.Area, { foreignKey: 'country_id', as: 'areas' });
    this.hasOne(models.DeliveryPrice, { foreignKey: 'country_id', as: 'deliveryPrice' });
    this.hasMany(models.DeliveryPrice, { foreignKey: 'country_id', as: 'deliveryPrices' });
  }

  // Replicate Laravel's scopeActive
  static active(query) {
    return query.where({ active: true });
  }

  // Replicate Laravel's scopeFilter
  static filter(query, filter) {
    const isApiRoute = request().is('api/v1/rest/*');
    const lang = request().query('lang');

    query
      .when(isApiRoute && lang, (q) => q.where({
        '$translation.locale$': {
          [Op.or]: [
            { [Op.eq]: lang },
            { [Op.eq]: models.Language.findOne({ where: { default: 1 } })?.locale || 'en' },
          ],
        },
      }, {
        include: [{ model: models.CountryTranslation, as: 'translation' }],
      }))
      .when(filter.code, (q, code) => q.where({ code }))
      .when(filter.region_id, (q, regionId) => q.where({ region_id: regionId }))
      .when(filter.has_price, (q) => q.where({}, {
        include: [{ model: models.DeliveryPrice, as: 'deliveryPrice' }],
      }))
      .when(typeof filter.active !== 'undefined', (q) => q.where({ active: filter.active }))
      .when(filter.search, (q, search) => q.where({
        [Op.or]: [
          { '$translations.title$': { [Op.like]: `%${search}%` } },
          { '$translations.id$': search },
        ],
      }, {
        include: [{
          model: models.CountryTranslation,
          as: 'translations',
          attributes: ['id', 'country_id', 'locale', 'title'],
        }],
      }));

    return query;
  }
}

// Initialize the model
Country.init();

module.exports = Country;