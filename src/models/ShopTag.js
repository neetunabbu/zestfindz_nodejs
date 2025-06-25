const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

const ShopTag = sequelize.define('ShopTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true, // ✅ should be nullable, matching your PostgreSQL table
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'shop_tags',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Relationships
ShopTag.hasMany(sequelize.models.ShopTagTranslation, { as: 'translations', foreignKey: 'shop_tag_id' });
ShopTag.hasOne(sequelize.models.ShopTagTranslation, { as: 'translation', foreignKey: 'shop_tag_id' });
ShopTag.hasMany(sequelize.models.AssignShopTag, { as: 'assignShopTags', foreignKey: 'shop_tag_id' });
ShopTag.hasMany(sequelize.models.Gallery, { as: 'galleries', foreignKey: 'shop_tag_id' });

// Related Models (stubs)
const ShopTagTranslation = sequelize.define('ShopTagTranslation', {}, { tableName: 'shop_tag_translations', timestamps: false });
const AssignShopTag = sequelize.define('AssignShopTag', {}, { tableName: 'assign_shop_tags', timestamps: false });
const Gallery = sequelize.define('Gallery', {}, { tableName: 'galleries', timestamps: false });

module.exports = ShopTag;
