const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.BIGINT,      // ✅ BIGINT for PostgreSQL BIGSERIAL
    primaryKey: true,
    autoIncrement: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  region_id: {
    type: DataTypes.BIGINT,      // ✅ BIGINT for PostgreSQL
    allowNull: true,
  },
  country_id: {
    type: DataTypes.BIGINT,      // ✅ BIGINT for PostgreSQL
    allowNull: true,
  },
  city_id: {
    type: DataTypes.BIGINT,      // ✅ BIGINT for PostgreSQL
    allowNull: true,
  },
}, {
  tableName: 'areas',
  timestamps: false,
});

// Define model relationships via associate function
Area.associate = (models) => {
  Area.hasMany(models.AreaTranslation, { as: 'translations', foreignKey: 'area_id' });
  Area.hasOne(models.AreaTranslation, { as: 'translation', foreignKey: 'area_id' });

  Area.hasOne(models.DeliveryPrice, { as: 'deliveryPrice', foreignKey: 'area_id' });
  Area.hasMany(models.DeliveryPrice, { as: 'deliveryPrices', foreignKey: 'area_id' });
};

// Scopes
Area.addScope('active', {
  where: {
    active: true,
  },
});

Area.addScope('filter', (filter, lang, defaultLocale) => {
  return {
    include: [
      {
        model: sequelize.models.AreaTranslation,
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
        model: sequelize.models.AreaTranslation,
        as: 'translations',
        required: false,
        where: filter.search ? {
          [Sequelize.Op.or]: [
            { title: { [Sequelize.Op.iLike]: `%${filter.search}%` } },
            { id: filter.search },
          ],
        } : {},
        attributes: ['id', 'area_id', 'locale', 'title'],
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
      ...(filter.city_id && { city_id: filter.city_id }),
      ...(typeof filter.active !== 'undefined' && { active: filter.active }),
    },
  };
});

module.exports = Area;
