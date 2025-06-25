const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

const City = sequelize.define('City', {
  id: {
    type: DataTypes.BIGINT,      // ✅ BIGINT to match PostgreSQL BIGSERIAL
    primaryKey: true,
    autoIncrement: true,
  },
  region_id: {
    type: DataTypes.BIGINT,      // ✅ BIGINT to match PostgreSQL
    allowNull: true,
  },
  country_id: {
    type: DataTypes.BIGINT,      // ✅ BIGINT to match PostgreSQL
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'cities',
  timestamps: false,
});

// Define model relationships via associate function
City.associate = (models) => {
  City.hasMany(models.CityTranslation, { as: 'translations', foreignKey: 'city_id' });
  City.hasOne(models.CityTranslation, { as: 'translation', foreignKey: 'city_id' });

  City.hasOne(models.Area, { as: 'area', foreignKey: 'city_id' });
  City.hasMany(models.Area, { as: 'areas', foreignKey: 'city_id' });

  City.hasOne(models.DeliveryPrice, { as: 'deliveryPrice', foreignKey: 'city_id' });
  City.hasMany(models.DeliveryPrice, { as: 'deliveryPrices', foreignKey: 'city_id' });
};

// Scopes
City.addScope('active', {
  where: {
    active: true,
  },
});

City.addScope('filter', (filter, lang, defaultLocale) => {
  return {
    include: [
      {
        model: sequelize.models.CityTranslation,
        as: 'translation',
        required: false,
        where: lang ? {
          [Sequelize.Op.or]: [
            { locale: lang },
            { locale: defaultLocale },
          ],
        } : {},
      },
      {
        model: sequelize.models.CityTranslation,
        as: 'translations',
        required: false,
        where: filter.search ? {
          [Sequelize.Op.or]: [
            { title: { [Sequelize.Op.iLike]: `%${filter.search}%` } },
            { id: filter.search },
          ],
        } : {},
        attributes: ['id', 'city_id', 'locale', 'title'],
      },
      {
        model: sequelize.models.DeliveryPrice,
        as: 'deliveryPrice',
        required: filter.has_price || false,
      },
    ],
    where: {
      ...(filter.region_id && { region_id: filter.region_id }),
      ...(filter.country_id && { country_id: filter.country_id }),
      ...(typeof filter.active !== 'undefined' && { active: filter.active }),
    },
  };
});

module.exports = City;
