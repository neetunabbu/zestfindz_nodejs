const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Like extends Model {
  static TYPES = {
    blog: 'App\\Models\\Blog',
    product: 'App\\Models\\Product',
    shop: 'App\\Models\\Shop',
    banner: 'App\\Models\\Banner',
  };

  static async filter(query, filter) {
    if (filter.type) {
      const type = Like.TYPES[filter.type] || 'App\\Models\\Product';
      query.where({ likable_type: type });
    }

    if (filter.type_id) {
      query.where({ likable_id: filter.type_id });
    }

    if (filter.user_id) {
      query.where({ user_id: filter.user_id });
    }

    return query;
  }
}

Like.init(
  {
    id: {
      type: DataTypes.BIGINT, // ✅ match PostgreSQL BIGSERIAL
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    likable_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likable_id: {
      type: DataTypes.BIGINT, // ✅ match PostgreSQL BIGINT
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT, // ✅ match PostgreSQL BIGINT
      allowNull: false,
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
    modelName: 'Like',
    tableName: 'likes',
    underscored: true,
    timestamps: true,
  }
);

// Associations
Like.associate = (models) => {
  Like.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  
  // You can handle polymorphic logic manually in your query logic
  // Sequelize doesn't support native polymorphic belongsTo, unless you use sequelize-polymorphic
};

module.exports = Like;
