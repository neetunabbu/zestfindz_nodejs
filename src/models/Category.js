// src/models/Category.js
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
    keywords: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.ENUM('main', 'sub_main', 'child', 'receipt'), 
      allowNull: false,
      defaultValue: 'main',
    },
    input: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    age_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    shop_id: {
      type: DataTypes.INTEGER, // Assuming INTEGER for shop_id
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
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    return_window_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gst: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
  }, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,      // Added for consistency with other models
    freezeTableName: true,  // Added for consistency with other models
  });

  // Define associations for Category
  Category.associate = (models) => {
    // Category has many translations
    Category.hasMany(models.CategoryTranslation, {
      foreignKey: 'category_id',
      as: 'translations',
    })

    // Category has many meta tags (polymorphic association)
    Category.hasMany(models.CategoryMetaTag, {
      foreignKey: 'translatable_id',
      constraints: false, // Important for polymorphic associations
      scope: {
        translatable_type: 'Category',
      },
      as: 'metaTags',
    });

    // Category can belong to a Shop
    Category.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
    });

    // Self-referencing association for parent/child categories
    Category.belongsTo(models.Category, {
      foreignKey: 'parent_id',
      as: 'parent',
      // Optional: Add onDelete/onUpdate if you want cascading behavior
      // onDelete: 'CASCADE',
    });
    Category.hasMany(models.Category, {
      foreignKey: 'parent_id',
      as: 'children',
    });

    // If products belong to categories:
    // Category.hasMany(models.Product, {
    //   foreignKey: 'category_id',
    //   as: 'products',
    // });
  Category.associate = models => {
    Category.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    Category.belongsTo(models.Category, { foreignKey: 'parent_id', as: 'parent' });
    Category.hasMany(models.Category, { foreignKey: 'parent_id', as: 'children' });
  };

  return Category;
};
