const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Tag extends Model {}

Tag.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true  // reflect DB default
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Tag',
  tableName: 'tags',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Relationships
Tag.associate = (models) => {
  Tag.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });

  Tag.hasMany(models.TagTranslation, {
    foreignKey: 'tag_id',
    as: 'translations'
  });

  Tag.hasOne(models.TagTranslation, {
    foreignKey: 'tag_id',
    as: 'translation'
  });
};

module.exports = Tag;
