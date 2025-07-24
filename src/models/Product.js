module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    shop_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    brand_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    unit_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    keywords: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qr_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('published', 'pending', 'unpublished'),
      defaultValue: 'pending',
    },
    min_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    max_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 2147483647,
    },
    digital: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    age_limit: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    interval: {
      type: DataTypes.DOUBLE,
      defaultValue: 1,
    },
    status_note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    r_count: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    r_avg: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    r_sum: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    o_count: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    od_count: {
      type: DataTypes.DOUBLE,
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
    min_price: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    max_price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    currency_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    country_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    city_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    region_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      defaultValue: 'N/A',
    },
    // seo_tags: {
    //   type: DataTypes.JSONB,
    //   allowNull: true,
    // }
  }, {
    tableName: 'products',
    timestamps: false,
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  /**
   * Associations
   */
  Product.associate = function(models) {
    Product.belongsTo(models.Shop, {
      foreignKey: 'shop_id',
      as: 'shop',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Product.belongsTo(models.Brand, {
      foreignKey: 'brand_id',
      as: 'brand',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Product.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
      as: 'unit',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
     Product.hasMany(models.Stock, {
    foreignKey: 'product_id',
    as: 'stocks',
  });
  Product.hasMany(models.Translation, {
    foreignKey: 'translationable_id',
    constraints: false,
    scope: {
      translationable_type: 'Product',
    },
    as: 'translations',
  });
  };

  return Product;
};
