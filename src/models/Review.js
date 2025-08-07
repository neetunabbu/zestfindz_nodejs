module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    reviewable_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Product', 'Blog', 'Shop']],
      },
    },
    reviewable_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    assignable_type: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [['Shop']],
      },
    },
    assignable_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 5,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reply: {
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
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Review.associate = models => {
    Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

    Review.belongsTo(models.Product, {
      foreignKey: 'reviewable_id',
      constraints: false,
      as: 'reviewedProduct',
    });
    Review.belongsTo(models.Blog, {
      foreignKey: 'reviewable_id',
      constraints: false,
      as: 'reviewedBlog',
    });
    Review.belongsTo(models.Shop, {
      foreignKey: 'reviewable_id',
      constraints: false,
      as: 'reviewedShop',
    });

    Review.belongsTo(models.Shop, {
      foreignKey: 'assignable_id',
      constraints: false,
      as: 'assignedShop',
    });
    Review.belongsTo(models.Product, {
      foreignKey: 'reviewable_id',
      constraints: false,
      as: 'product',
    });
    Review.hasMany(models.Gallery, {
      foreignKey: 'loadable_id',
      constraints: false,
      scope: {
        loadable_type: 'Review',
      },
      as: 'galleries',
    });

  };

  return Review;
};
