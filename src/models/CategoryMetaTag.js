// src/models/CategoryMetaTag.js
module.exports = (sequelize, DataTypes) => {
  const CategoryMetaTag = sequelize.define('CategoryMetaTag', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      // allowNull: false,
    },
    translatable_id: { // Assuming this refers to category_id based on your controller logic
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    translatable_type: { // For polymorphic association, typically 'Category'
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT, // Use TEXT for potentially longer meta values
      allowNull: true,
    },
    // If you have timestamps for meta tags, add them here:
    // created_at: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },
    // updated_at: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },
  }, {
    tableName: 'category_meta_tags', // Ensure this matches your actual table name
    timestamps: false, // Adjust based on whether this table has created_at/updated_at
    underscored: true,
    freezeTableName: true,
  });

  // Define associations for CategoryMetaTag
CategoryMetaTag.associate = (models) => {
  CategoryMetaTag.belongsTo(models.Category, {
    foreignKey: 'translatable_id',
    constraints: false,
    as: 'category',
  });
};

  return CategoryMetaTag;
};

