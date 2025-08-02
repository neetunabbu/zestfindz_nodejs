const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BlogReview = sequelize.define('BlogReview', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    blog_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
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
  }, {
    tableName: 'blog_reviews',
    underscored: true,
    timestamps: false,
  });

  BlogReview.associate = (models) => {
    // BlogReview.belongsTo(models.Blog, {
    //   foreignKey: 'blog_id',
    //   as: 'blog',
    // });
    BlogReview.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    BlogReview.belongsTo(models.Blog, { foreignKey: 'blog_id', as: 'blog' });
  };

  return BlogReview;
};
