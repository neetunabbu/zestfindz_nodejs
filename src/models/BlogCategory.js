const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class BlogCategory extends Model {}

BlogCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BlogCategory',
    tableName: 'blog_categories',
    timestamps: false,  // disable timestamps to match your current table
  }
);

// ✅ Associations
BlogCategory.associate = (models) => {
  BlogCategory.hasMany(models.Blog, {
    foreignKey: 'category_id',
    sourceKey: 'id',
    as: 'blogs',
  });
};

module.exports = BlogCategory;
