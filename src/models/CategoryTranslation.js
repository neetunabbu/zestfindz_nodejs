const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CategoryTranslation extends Model {
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
        locale: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'CategoryTranslation',
        tableName: 'category_translations',
        timestamps: false,
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have a direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // No casts defined in Laravel model
      }
    );
  }
}

// Initialize the model
CategoryTranslation.init();

module.exports = CategoryTranslation;