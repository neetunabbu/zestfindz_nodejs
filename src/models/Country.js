const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.BIGINT,            // ✅ BIGINT to match PostgreSQL BIGSERIAL
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  region_id: {
    type: DataTypes.BIGINT,            // ✅ BIGINT to match PostgreSQL BIGINT
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
}, {
  tableName: 'countries',
  timestamps: false,
});

// Define model relationships via associate function
Country.associate = (models) => {
  Country.hasMany(models.CountryTranslation, { as: 'translations', foreignKey: 'country_id' });
  Country.hasOne(models.CountryTranslation, { as: 'translation', foreignKey: 'country_id' });

  Country.hasOne(models.City, { as: 'city', foreignKey: 'country_id' });
  Country.hasMany(models.City, { as: 'cities', foreignKey: 'country_id' });

  Country.hasOne(models.Area, { as: 'area', foreignKey: 'country_id' });
  Country.hasMany(models.Area, { as: 'areas', foreignKey: 'country_id' });

  Country.hasOne(models.DeliveryPrice, { as: 'deliveryPrice', foreignKey: 'country_id' });
  Country.hasMany(models.DeliveryPrice, { as: 'deliveryPrices', foreignKey: 'country_id' });
};

// Define Scopes
Country.addScope('active', {
  where: {
    active: true,
  },
});

Country.addScope('filter', (filter, lang, defaultLocale) => {
  return {
    include: [
      {
        model: sequelize.models.CountryTranslation,
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
        model: sequelize.models.CountryTranslation,
        as: 'translations',
        required: false,
        where: filter.search ? {
          [Sequelize.Op.or]: [
            { title: { [Sequelize.Op.iLike]: `%${filter.search}%` } },
            { id: filter.search },
          ],
        } : {},
        attributes: ['id', 'country_id', 'locale', 'title'],
      },
      {
        model: sequelize.models.DeliveryPrice,
        as: 'deliveryPrice',
        required: filter.has_price || false,
      },
    ],
    where: {
      ...(filter.code && { code: filter.code }),
      ...(filter.region_id && { region_id: filter.region_id }),
      ...(typeof filter.active !== 'undefined' && { active: filter.active }),
    },
  };
});

module.exports = Country;
