// models/blogCategory.model.js

module.exports = (sequelize, DataTypes) => {
  const BlogCategory = sequelize.define('BlogCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'blog_categories',
    timestamps: false, // Set to true if you plan to use createdAt/updatedAt columns
    underscored: true
  });

  return BlogCategory;
};
