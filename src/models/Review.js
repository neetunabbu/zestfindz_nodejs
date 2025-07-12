'use strict';

const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

// Note: Traits like Loadable, UserSearch are Laravel-specific
// In Sequelize, equivalent logic would be done inside methods or scopes

class Review extends Model {
  // Constants — exact Laravel equivalent
  static REVIEW_TYPES = {
    BLOG: 'blog',
    ORDER: 'order',
    SHOP: 'shop',
    PRODUCT: 'product',
  };

  static ASSIGN_TYPES = {
    SHOP: 'shop',
    USER: 'user',
  };

  // Equivalent of scopeFilter in Laravel
  static filter(filter = {}) {
    const where = {};
    const include = [];

    // type filter
    if (filter.type) {
      const typeClass = `${filter.type.charAt(0).toUpperCase()}${filter.type.slice(1)}`;
      where.reviewable_type = {
        [Op.like]: `%${typeClass}%`,
      };

      if (filter.type_id) {
        where.reviewable_id = filter.type_id;
      }
    }

    // assign filter
    if (filter.assign) {
      const assignClass = `${filter.assign.charAt(0).toUpperCase()}${filter.assign.slice(1)}`;
      where.assignable_type = {
        [Op.like]: `%${assignClass}%`,
      };

      if (filter.assign_id) {
        where.assignable_id = filter.assign_id;
      }
    }

    // date range
    if (filter.date_from) {
      where.created_at = {
        [Op.gte]: filter.date_from,
        ...(filter.date_to && { [Op.lte]: filter.date_to }),
      };
    }

    // user_id filter
    if (filter.user_id) {
      where.user_id = filter.user_id;
    }

    // comment search
    if (filter.search) {
      where[Op.or] = [
        {
          comment: {
            [Op.iLike]: `%${filter.search}%`,
          },
        },
      ];
      // UserSearch equivalent: assuming 'user' association has searchable fields
      include.push({
        model: User,
        as: 'user',
      });
    }

    return {
      where,
      include,
    };
  }
}

Review.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    reviewable_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewable_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    assignable_type: {
      type: DataTypes.STRING,
      allowNull: true,
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
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
  }
);

// Associations

// belongsTo User
Review.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Note: Polymorphic relations like reviewable() and assignable() in Laravel
// Sequelize doesn't natively support morphTo — handle manually via type & id fields in queries

// Laravel's Traits: HasFactory, Loadable, UserSearch
// Not directly applicable in Sequelize — logic should be implemented inside static methods or query helpers

module.exports = Review;
