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
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    published_at: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    r_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    r_avg: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    r_sum: {
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
    getterMethods: {
      typeLabel() {
        return this.type === '2' ? 'notification' : 'blog';
      }
    }
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
