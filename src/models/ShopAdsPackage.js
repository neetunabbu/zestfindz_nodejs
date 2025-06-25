const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

const ShopAdsPackage = sequelize.define('ShopAdsPackage', {
  id: {
    type: DataTypes.BIGINT, // matches BIGSERIAL
    primaryKey: true,
    autoIncrement: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  ads_package_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  shop_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'new',  // <-- Added missing default
  },
  expired_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  position_page: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 1,  // <-- Added missing field
  },
}, {
  tableName: 'shop_ads_packages',
  timestamps: false,
});

// Constants
ShopAdsPackage.NEW = 'new';
ShopAdsPackage.APPROVED = 'approved';
ShopAdsPackage.CANCELED = 'canceled';

ShopAdsPackage.STATUSES = {
  [ShopAdsPackage.NEW]: ShopAdsPackage.NEW,
  [ShopAdsPackage.APPROVED]: ShopAdsPackage.APPROVED,
  [ShopAdsPackage.CANCELED]: ShopAdsPackage.CANCELED,
};

// Associations
ShopAdsPackage.belongsTo(sequelize.models.Shop, { as: 'shop', foreignKey: 'shop_id' });
ShopAdsPackage.belongsTo(sequelize.models.AdsPackage, { as: 'adsPackage', foreignKey: 'ads_package_id' });
ShopAdsPackage.hasOne(sequelize.models.ShopAdsProduct, { as: 'shopAdsProduct', foreignKey: 'shop_ads_package_id' });
ShopAdsPackage.hasMany(sequelize.models.ShopAdsProduct, { as: 'shopAdsProducts', foreignKey: 'shop_ads_package_id' });
ShopAdsPackage.hasOne(sequelize.models.PaymentProcess, {
  as: 'paymentProcess',
  foreignKey: 'model_id',
  scope: { model_type: 'ShopAdsPackage' },
});

// Scopes
ShopAdsPackage.addScope('active', {
  where: {
    active: true,
  },
});

ShopAdsPackage.addScope('filter', (filter) => {
  return {
    where: {
      ...(filter.ads_package_id && { ads_package_id: filter.ads_package_id }),
      ...(filter.shop_id && { shop_id: filter.shop_id }),
      ...(typeof filter.active !== 'undefined' && { active: filter.active }),
    },
  };
});

// Related models (stubs)
const Shop = sequelize.define('Shop', {}, { tableName: 'shops', timestamps: false });
const AdsPackage = sequelize.define('AdsPackage', {}, { tableName: 'ads_packages', timestamps: false });
const ShopAdsProduct = sequelize.define('ShopAdsProduct', {}, { tableName: 'shop_ads_products', timestamps: false });
const PaymentProcess = sequelize.define('PaymentProcess', {
  model_id: DataTypes.INTEGER,
  model_type: DataTypes.STRING,
}, { tableName: 'payment_processes', timestamps: false });

module.exports = ShopAdsPackage;
