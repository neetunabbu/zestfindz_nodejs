module.exports = (sequelize, DataTypes) => {
  const ParcelOrderSetting = sequelize.define('ParcelOrderSetting', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    img: DataTypes.STRING,
    min_width: DataTypes.INTEGER,
    min_height: DataTypes.INTEGER,
    min_length: DataTypes.INTEGER,
    max_width: DataTypes.INTEGER,
    max_height: DataTypes.INTEGER,
    max_length: DataTypes.INTEGER,
    max_range: DataTypes.INTEGER,
    min_g: DataTypes.INTEGER,
    max_g: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    price_per_km: DataTypes.INTEGER,
    special: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    special_price: DataTypes.INTEGER,
    special_price_per_km: DataTypes.INTEGER,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'parcel_order_settings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Association: many-to-many with ParcelOption
  ParcelOrderSetting.associate = (models) => {
    ParcelOrderSetting.belongsToMany(models.ParcelOption, {
      through: 'parcel_setting_options',
      foreignKey: 'parcel_order_setting_id',
      otherKey: 'parcel_option_id',
      as: 'parcelOptions'
    });
  };

  // Scope-like custom filter method
  ParcelOrderSetting.filter = function (filters = {}) {
    const { Op } = require('sequelize');
    const where = {};

    if (filters.min_width) where.min_width = { [Op.gte]: filters.min_width };
    if (filters.min_height) where.min_height = { [Op.gte]: filters.min_height };
    if (filters.min_length) where.min_length = { [Op.gte]: filters.min_length };
    if (filters.min_range) where.max_range = { [Op.lte]: filters.min_range };

    if (filters.max_width) where.max_width = { [Op.lte]: filters.max_width };
    if (filters.max_height) where.max_height = { [Op.lte]: filters.max_height };
    if (filters.max_length) where.max_length = { [Op.lte]: filters.max_length };
    if (filters.max_range) where.max_range = { [Op.lte]: filters.max_range };

    if (filters.min_g) where.min_g = { [Op.gte]: filters.min_g };
    if (filters.max_g) where.max_g = { [Op.lte]: filters.max_g };

    if (typeof filters.special !== 'undefined') where.special = filters.special;

    if (filters.price_from && filters.price_to) {
      where.price = { [Op.between]: [filters.price_from, filters.price_to] };
    }

    if (filters.special_price_from && filters.special_price_to) {
      where.special_price = { [Op.between]: [filters.special_price_from, filters.special_price_to] };
    }

    return ParcelOrderSetting.findAll({
      where,
      include: [
        {
          model: sequelize.models.ParcelOption,
          as: 'parcelOptions',
          through: { attributes: [] }
        }
      ]
    });
  };

  return ParcelOrderSetting;
};

