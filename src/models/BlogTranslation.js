const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class BlogTranslation extends Model {}

BlogTranslation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(191), // matches VARCHAR(191)
      allowNull: false,
    },
    short_desc: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT, // ✅ fixed: TEXT to match PostgreSQL table
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'BlogTranslation',
    tableName: 'blog_translations',
    timestamps: false, // as per your Laravel $timestamps = false
  }
);

// ✅ Associations (optional)
BlogTranslation.associate = (models) => {
  BlogTranslation.belongsTo(models.Blog, { foreignKey: 'blog_id', as: 'blog' });
};

module.exports = BlogTranslation;
