module.exports = (sequelize, DataTypes) => {
  const ParcelOption = sequelize.define('ParcelOption', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'parcel_options',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ParcelOption.associate = (models) => {
    // Translations (hasMany)
    ParcelOption.hasMany(models.ParcelOptionTranslation, {
      foreignKey: 'parcel_option_id',
      as: 'translations',
    });

    // Single translation (hasOne)
    ParcelOption.hasOne(models.ParcelOptionTranslation, {
      foreignKey: 'parcel_option_id',
      as: 'translation',
    });

    // Many-to-Many with ParcelOrderSetting (optional)
    ParcelOption.belongsToMany(models.ParcelOrderSetting, {
      through: 'parcel_setting_options',
      foreignKey: 'parcel_option_id',
      otherKey: 'parcel_order_setting_id',
      as: 'parcelOrderSettings'
    });
  };

  // Laravel-style filter method
  ParcelOption.filter = function (filters = {}) {
    const { Op } = require('sequelize');
    const where = {};
    const include = [];

    if (filters.search) {
      const search = filters.search;

      include.push({
        model: sequelize.models.ParcelOptionTranslation,
        as: 'translations',
        where: {
          title: { [Op.iLike]: `%${search}%` }
        },
        required: false, // keep this non-required to also allow matching by ID
        attributes: ['id', 'parcel_option_id', 'locale', 'title']
      });

      where[Op.or] = [
        { id: search },
      ];
    }

    return ParcelOption.findAll({
      where,
      include,
      order: [['id', 'DESC']],
    });
  };

  return ParcelOption;
};
