const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Career extends Model {
  // Laravel-like scopeActive
  static scopeActive(query) {
    return query.where({ active: true });
  }

  // Laravel-like scopeFilter
  static scopeFilter(query, filter) {
    if (filter.category_id) {
      query.where({ category_id: filter.category_id });
    }
    if (filter.active !== undefined) {
      query.where({ active: filter.active });
    }
    if (filter.search) {
      query.where({
        '$translations.title$': {
          [Op.iLike]: `%${filter.search}%`
        }
      });
    }
    return query;
  }

  static associate(models) {
    this.hasMany(models.CareerTranslation, { foreignKey: 'career_id', as: 'translations' });
    this.hasOne(models.CareerTranslation, { foreignKey: 'career_id', as: 'translation' });
    this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
  }
}

Career.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true, // ✅ corrected from false to true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // ✅ corrected from false to true
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
    modelName: 'Career',
    tableName: 'careers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Career;
