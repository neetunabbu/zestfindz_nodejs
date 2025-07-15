'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Review belongs to User
      Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

      // Polymorphic relationships (reviewable & assignable)
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

      // Add more polymorphic targets as needed
    }
  }

  Review.init(
    {
      reviewable_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reviewable_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      assignable_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assignable_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
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
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'reviews',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Review;
};


