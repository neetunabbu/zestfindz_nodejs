const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

// Import Shop only after it's confirmed available to avoid circular require issues
const Shop = require('./Shop'); // make sure the filename is 'Shop.js' with capital S if this is how it's written in your filesystem

class ShopGallery extends Model {}

ShopGallery.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  shop_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ShopGallery',
  timestamps: false,              // No created_at or updated_at fields in table
  freezeTableName: true           // Prevent Sequelize from pluralizing table name
});

// Define relationship if Shop model exists
if (Shop) {
  ShopGallery.belongsTo(Shop, { as: 'shop', foreignKey: 'shop_id' });
}

// Optional: Add a clean scope/filter function for dynamic querying
ShopGallery.addScope('filter', (filter) => {
  const where = {};
  if (filter.shop_id) where.shop_id = filter.shop_id;
  if (typeof filter.active !== 'undefined') where.active = filter.active;

  return { where };
});

module.exports = ShopGallery;
