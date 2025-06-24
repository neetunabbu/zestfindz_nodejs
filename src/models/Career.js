const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Career extends Model {
  static init() {
    super.init(
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
          type: DataTypes.JSON,
          allowNull: false,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'active' is BOOLEAN, 'location' is JSON
      }
    );
  }

  static associate(models) {
    // Relationships
    this.hasMany(models.CareerTranslation, { foreignKey: 'career_id', as: 'translations' });
    this.hasOne(models.CareerTranslation, { foreignKey: 'career_id', as: 'translation' });
    this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
  }

  // Replicate Laravel's scopeActive
  static active(query) {
    return query.where({ active: true }); // Corrected from 'status' to 'active'
  }

  // Replicate Laravel's scopeFilter
  static filter(query, filter) {
    query
      .when(filter.category_id, (q, categoryId) => q.where({ category_id: categoryId }))
      .when(filter.active !== undefined, (q) => q.where({ active: filter.active }))
      .when(filter.search, (q, search) => q.where({
        '$translations.title$': { [Op.like]: `%${search}%` },
      }, {
        include: [{
          model: this.sequelize.models.CareerTranslation,
          as: 'translations',
          attributes: ['id', 'career_id', 'locale', 'title'],
        }],
      }));

    return query;
  }
}

// Initialize the model
Career.init();

module.exports = Career;