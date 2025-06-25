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
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'BlogTranslation',
    tableName: 'blog_translations',
    timestamps: false, // ✅ Laravel's $timestamps = false
  }
);

// ✅ Associations (none defined in Laravel, but can add if needed)
BlogTranslation.associate = (models) => {
  // Example if you want: BlogTranslation.belongsTo(models.Blog, { foreignKey: 'blog_id', as: 'blog' });
};

module.exports = BlogTranslation;
