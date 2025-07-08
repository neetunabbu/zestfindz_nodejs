// services/LocationService.js
const db = require('../models'); // Access to all Sequelize models and sequelize instance
const { Op, QueryTypes } = require('sequelize'); // Sequelize operators and QueryTypes

class LocationService {
  /**
   * @param {string|null} language - The current language locale.
   */
  constructor(language = null) {
    this.language = language;
  }

  /**
   * Retrieves shop IDs based on location filters from the 'shop_locations' table.
   * Corresponds to Laravel's getShopIds() method.
   * @param {object} filter - An object containing location filter parameters (region_id, country_id, city_id, area_id).
   * @returns {Promise<number[]>} An array of unique shop IDs.
   */
  async getShopIds(filter) {
    const regionId = filter.region_id ?? null;
    const countryId = filter.country_id ?? null;
    const cityId = filter.city_id ?? null;
    const areaId = filter.area_id ?? null;

    const byLocation = regionId || countryId || cityId || areaId;

    if (!byLocation) {
      return [];
    }

    // Build the WHERE clause dynamically
    let whereClauses = [];
    let replacements = {};

    if (regionId) {
      whereClauses.push(`"region_id" = :regionId`);
      replacements.regionId = regionId;
    }

    // For country_id, city_id, area_id, include OR NULL logic
    if (countryId) {
      whereClauses.push(`("country_id" = :countryId OR "country_id" IS NULL)`);
      replacements.countryId = countryId;
    }
    if (cityId) {
      whereClauses.push(`("city_id" = :cityId OR "city_id" IS NULL)`);
      replacements.cityId = cityId;
    }
    if (areaId) {
      whereClauses.push(`("area_id" = :areaId OR "area_id" IS NULL)`);
      replacements.areaId = areaId;
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Execute a raw SQL query to get shop_ids
    const queryString = `
      SELECT DISTINCT "shop_id"
      FROM "shop_locations"
      ${whereString}
    `;

    try {
      const results = await db.sequelize.query(queryString, {
        replacements: replacements,
        type: QueryTypes.SELECT,
      });

      // Extract unique shop_ids and convert to an array of numbers
      return results.map(row => row.shop_id);
    } catch (error) {
      console.error('Error in getShopIds:', error);
      // Depending on your error handling strategy, you might re-throw or return an empty array
      throw error;
    }
  }

  /**
   * Applies search filters to a Sequelize query based on location translations.
   * Corresponds to Laravel's search() method.
   * @param {object} query - The base Sequelize query builder instance (e.g., Shop.scope(...)).
   * @param {string|null} search - The search string.
   * @returns {object} The modified Sequelize query builder instance.
   */
  search(query, search) {
    if (!search) {
      return query;
    }

    return query.where({
      [Op.or]: [
        // Search in Region Translation
        {
          '$region.translation.title$': {
            [Op.iLike]: `%${search}%` // Use Op.iLike for case-insensitive LIKE in PostgreSQL
          }
        },
        // Search in Country Translation
        {
          '$country.translation.title$': {
            [Op.iLike]: `%${search}%`
          }
        },
        // Search in City Translation
        {
          '$city.translation.title$': {
            [Op.iLike]: `%${search}%`
          }
        },
        // Search in Area Translation
        {
          '$area.translation.title$': {
            [Op.iLike]: `%${search}%`
          }
        }
      ]
    });
  }

  /**
   * Defines eager loading relationships for location translations.
   * Corresponds to Laravel's getWith() method.
   * @returns {Promise<object[]>} An array of Sequelize include objects.
   */
  async getWith() {
    const defaultLanguage = await db.Language.findOne({ where: { default: true } });
    const defaultLocale = defaultLanguage ? defaultLanguage.locale : 'en';

    // Ensure this.language is set, fallback to defaultLocale if not
    const currentLocale = this.language || defaultLocale;

    const translationWhere = {
      [Op.or]: [
        { locale: currentLocale },
        { locale: defaultLocale }
      ]
    };

    return [
      {
        model: db.Region,
        as: 'region',
        include: [
          {
            model: db.RegionTranslation,
            as: 'translation',
            where: translationWhere,
            required: false // Use required: false for LEFT JOIN
          }
        ]
      },
      {
        model: db.Country,
        as: 'country',
        include: [
          {
            model: db.CountryTranslation,
            as: 'translation',
            where: translationWhere,
            required: false
          }
        ]
      },
      {
        model: db.City,
        as: 'city',
        include: [
          {
            model: db.CityTranslation,
            as: 'translation',
            where: translationWhere,
            required: false
          }
        ]
      },
      {
        model: db.Area,
        as: 'area',
        include: [
          {
            model: db.AreaTranslation,
            as: 'translation',
            where: translationWhere,
            required: false
          }
        ]
      },
    ];
  }

  /**
   * Retrieves shop IDs based on location filters, potentially overriding with a direct shop_id.
   * Corresponds to Laravel's getIds() method.
   * @param {object} filter - An object containing location filter parameters and potentially a direct shop_id.
   * @returns {Promise<number[]>} An array of shop IDs.
   */
  async getIds(filter) {
    const regionId = filter.region_id;
    const countryId = filter.country_id;
    const cityId = filter.city_id;
    const areaId = filter.area_id;
    const byLocation = regionId || countryId || cityId || areaId;

    let shopIds = [];

    if (byLocation) {
      shopIds = await this.getShopIds(filter);
    }

    if (filter.shop_id) {
      // Ensure filter.shop_id is always an array for consistency
      shopIds = Array.isArray(filter.shop_id) ? filter.shop_id : [filter.shop_id];
    }

    return shopIds;
  }
}

module.exports = LocationService;
