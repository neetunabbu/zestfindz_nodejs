const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Area extends Model {
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
        region_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        country_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        city_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Area',
        tableName: 'areas',
        timestamps: false, // Match Laravel's $timestamps = false
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'active' is already BOOLEAN, no additional casting needed
      }
    );
  }

  // Traits (to be implemented separately as needed)
  // Regions: Custom trait for region-related functionality
  // Countries: Custom trait for country-related functionality
  // Cities: Custom trait for city-related functionality
  // Note: These traits are not implemented here as per "no additions" instruction
  // Implement these as separate utilities or include in a base class if needed

  static associate(models) {
    // Relationships
    this.hasMany(models.AreaTranslation, { foreignKey: 'area_id', as: 'translations' });
    this.hasOne(models.AreaTranslation, { foreignKey: 'area_id', as: 'translation' });
    this.hasOne(models.DeliveryPrice, { foreignKey: 'area_id', as: 'deliveryPrice' });
    this.hasMany(models.DeliveryPrice, { foreignKey: 'area_id', as: 'deliveryPrices' });
  }

  // Scopes
  static active(query) {
    return query.where({ active: true });
  }

  static async filter(query, filter) {
    // Simulate Laravel's request() and is() functions
    // Assumes filter contains 'lang' and request context (e.g., filter.isRestApi, filter.lang)
    // In a real app, pass request data explicitly or use a middleware
    const isRestApi = filter.isRestApi || false; // Placeholder for request()->is('api/v1/rest/*')
    const lang = filter.lang || null; // Placeholder for request('lang')

    // Placeholder for Language model (used in Laravel's filter scope)
    // Assumes a Language model exists with 'locale' and 'default' fields
    const getDefaultLocale = async () => {
      // Implement Language::where('default', 1)->first()?->locale
      // Example: return models.Language.findOne({ where: { default: 1 } })?.locale;
      throw new Error('Language model and default locale logic must be implemented');
    };

    query = query
      .when(isRestApi && lang, (q) =>
        q.where({
          '$translation.locale$': {
            [Op.or]: [lang, getDefaultLocale()],
          },
        }, {
          include: [{
            model: this.sequelize.models.AreaTranslation,
            as: 'translation',
          }],
        })
      )
      .when(filter.region_id, (q, regionId) => q.where({ region_id: regionId }))
      .when(filter.country_id, (q, countryId) => q.where({ country_id: countryId }))
      .when(filter.city_id, (q, cityId) => q.where({ city_id: cityId }))
      .when(filter.has_price, (q) =>
        q.where({
          '$deliveryPrice.id$': { [Op.ne]: null },
        }, {
          include: [{ model: this.sequelize.models.DeliveryPrice, as: 'deliveryPrice' }],
        })
      )
      .when(filter.active !== undefined, (q) => q.where({ active: filter.active }))
      .when(filter.search, (q, search) =>
        q.where({
          [Op.or]: [
            { '$translations.title$': { [Op.like]: `%${search}%` } },
            { '$translations.id$': search },
          ],
        }, {
          include: [{
            model: this.sequelize.models.AreaTranslation,
            as: 'translations',
            attributes: ['id', 'area_id', 'locale', 'title'],
          }],
        })
      );

    return query;
  }
}

// Initialize the model
Area.init();

module.exports = Area;