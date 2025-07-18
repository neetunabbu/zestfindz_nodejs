module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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
    shop_id: {
      type: DataTypes.INTEGER, // Changed to INTEGER to match common foreign key types, assuming shop.id is INTEGER
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
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true, // Added for consistency
    freezeTableName: true, // Added for consistency
  });

  // Associations
  Brand.associate = (models) => {
    // Only define associations if the related models exist
    if (models.Product) {
      Brand.hasMany(models.Product, { 
        foreignKey: 'brand_id', 
        as: 'products' 
      });
    }

    if (models.Shop) {
      Brand.belongsTo(models.Shop, { 
        foreignKey: 'shop_id', 
        as: 'shop' 
      });
    }

    // Remove or fix ModelLog association if it doesn't exist
    // if (models.ModelLog) {
    //   Brand.hasMany(models.ModelLog, {
    //     foreignKey: 'model_id',
    //     constraints: false,
    //     scope: {
    //       model_type: 'App\\Models\\Brand',
    //     },
    //     as: 'logs',
    //   });
    // }
  };

  // Replicate Laravel's scopeUpdatedDate as a static method
  // This method will modify the `queryOptions` object directly.
  Brand.updatedDate = function(queryOptions, updatedDate) {
    if (!queryOptions.where) {
      queryOptions.where = {};
    }
    queryOptions.where.updated_at = { [sequelize.Op.gt]: updatedDate };
    return queryOptions;
  };

  // Replicate Laravel's scopeFilter as a static method
  // This method will modify the `queryOptions` object directly.
  Brand.filter = function(queryOptions, filter = {}) {
    if (!queryOptions.where) {
      queryOptions.where = {};
    }
    if (!queryOptions.include) {
      queryOptions.include = [];
    }
    if (!queryOptions.order) {
      queryOptions.order = [];
    }

    const Op = sequelize.Op; // Get Op from sequelize instance

    if (filter.search) {
      queryOptions.where.title = { [Op.iLike]: `%${filter.search}%` }; // Use iLike for case-insensitive search
    }

    if (filter.slug) {
      queryOptions.where.slug = filter.slug;
    }

    if (filter.shop_id) {
      if (filter.is_admin === undefined) { // If is_admin is not explicitly set
        queryOptions.where[Op.or] = [
          { shop_id: filter.shop_id },
          { shop_id: { [Op.is]: null } }, // Allow null shop_id for global brands
        ];
      } else { // If is_admin is explicitly set (e.g., true or false)
        queryOptions.where.shop_id = filter.shop_id;
      }
    }

    if (filter.active !== undefined) {
      queryOptions.where.active = filter.active;
    }

    if (filter.category_id) {
      // Ensure products and stocks are included for this filter
      let productInclude = queryOptions.include.find(inc => inc.as === 'products');
      if (!productInclude) {
        productInclude = {
          model: sequelize.models.Product,
          as: 'products',
          required: true, // INNER JOIN to ensure products exist
          include: [],
        };
        queryOptions.include.push(productInclude);
      } else {
        productInclude.required = true; // Ensure it's an INNER JOIN
      }

      // Add conditions to the product include's `where` clause
      if (!productInclude.where) {
        productInclude.where = {};
      }
      productInclude.where.category_id = filter.category_id;
      productInclude.where.active = true;
      productInclude.where.status = 'published'; // Assumes Product.PUBLISHED = 'published'

      // Ensure Stock is included in Product include
      let stockInclude = productInclude.include.find(inc => inc.as === 'stocks');
      if (!stockInclude) {
        stockInclude = {
          model: sequelize.models.Stock,
          as: 'stocks',
          required: true, // INNER JOIN to ensure stocks exist
          where: { quantity: { [Op.gt]: 0 } },
        };
        productInclude.include.push(stockInclude);
      } else {
        stockInclude.required = true;
        if (!stockInclude.where) {
          stockInclude.where = {};
        }
        stockInclude.where.quantity = { [Op.gt]: 0 };
      }
    }

    // Order by column or default to 'id' desc
    if (filter.column) {
      queryOptions.order.push([filter.column, filter.sort || 'desc']);
    } else {
      queryOptions.order.push(['id', 'desc']);
    }

    return queryOptions;
  };

  return Brand;
};
