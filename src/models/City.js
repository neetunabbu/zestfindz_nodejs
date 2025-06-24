const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class City extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        region_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        country_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'City',
        tableName: 'cities',
        timestamps: false,
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have a direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'active' is BOOLEAN
      }
    );
  }

  // Traits (to be implemented separately as needed)
  // Regions: Custom trait for region-related functionality
  // Countries: Custom trait for country-related functionality
  // Note: These traits are not implemented here as per "no additions" instruction
  // Implement as separate utilities or include in a base class if needed

  static associate(models) {
    // Relationships
    this.hasMany(models.CityTranslation, { foreignKey: 'city_id', as: 'translations' });
    this.hasOne(models.CityTranslation, { foreignKey: 'city_id', as: 'translation' });
    this.hasOne(models.Area, { foreignKey: 'city_id', as: 'area' });
    this.hasMany(models.Area, { foreignKey: 'city_id', as: 'areas' });
    this.hasOne(models.DeliveryPrice, { foreignKey: 'city_id', as: 'deliveryPrice' });
    this.hasMany(models.DeliveryPrice, { foreignKey: 'city_id', as: 'deliveryPrices' });
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
        include: [{ model: models.CityTranslation, as: 'translation' }],
      }))
      .when(filter.region_id, (q, regionId) => q.where({ region_id: regionId }))
      .when(filter.country_id, (q, countryId) => q.where({ country_id: countryId }))
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
          model: models.CityTranslation,
          as: 'translations',
          attributes: ['id', 'city_id', 'locale', 'title'],
        }],
      }));

    return query;
  }
}

// Initialize the model
City.init();

module.exports = City;