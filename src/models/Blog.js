const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    img: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    r_count: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    r_avg: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    r_sum: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Blog',
    tableName: 'blogs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// ✅ Constants
Blog.TYPES = {
  blog: 1,
  notification: 2,
};

// ✅ Associations
Blog.associate = (models) => {
  Blog.hasMany(models.BlogTranslation, { foreignKey: 'blog_id', as: 'translations' });
  Blog.hasOne(models.BlogTranslation, { foreignKey: 'blog_id', as: 'translation' });
};

module.exports = Blog;
