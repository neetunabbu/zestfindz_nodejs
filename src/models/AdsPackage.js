const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class AdsPackage extends Model {}

AdsPackage.init(
  {
    id: {
      type: DataTypes.BIGINT, // ✅ use BIGINT to match BIGSERIAL
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
      defaultValue: 'main', // ✅ matches SQL default
    },
    time_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'day', // ✅ matches SQL default
    },
    time: {
      type: DataTypes.SMALLINT, // ✅ matches PostgreSQL SMALLINT
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE, // ✅ matches DOUBLE PRECISION
      allowNull: false,
      defaultValue: 0, // ✅ matches SQL default
    },
    product_limit: {
      type: DataTypes.SMALLINT, // ✅ should be SMALLINT
      allowNull: true, // ✅ nullable
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    position_page: {
      type: DataTypes.SMALLINT, // ✅ correct type
      allowNull: false,
      defaultValue: 1, // ✅ matches SQL default
    },
  },
  {
    sequelize,
    modelName: 'AdsPackage',
    tableName: 'ads_packages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Constants (optional, keep if you're using them elsewhere)
AdsPackage.MAIN = 'main';
AdsPackage.STANDARD = 'standard';
AdsPackage.MAIN_TOP_BANNER = 'main_top_banner';
AdsPackage.MAIN_BANNER = 'main_banner';
AdsPackage.MAIN_LEFT_BANNER = 'main_left_banner';
AdsPackage.MAIN_RIGHT_BANNER = 'main_right_banner';
AdsPackage.STANDARD_TOP_BANNER = 'standard_top_banner';

AdsPackage.MINUTE = 'minute';
AdsPackage.HOUR = 'hour';
AdsPackage.DAY = 'day';
AdsPackage.WEEK = 'week';
AdsPackage.MONTH = 'month';
AdsPackage.YEAR = 'year';

// Relationships
AdsPackage.associate = (models) => {
  AdsPackage.hasMany(models.AdsPackageTranslation, { foreignKey: 'ads_package_id', as: 'translations' });
  AdsPackage.hasOne(models.AdsPackageTranslation, { foreignKey: 'ads_package_id', as: 'translation' });
  AdsPackage.hasMany(models.ShopAdsPackage, { foreignKey: 'ads_package_id', as: 'shopAdsPackages' });
};

module.exports = AdsPackage;
