const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class CityTranslation extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        city_id: {
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
      },
      {
        sequelize,
        modelName: 'CityTranslation',
        tableName: 'city_translations',
        timestamps: false,
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have a direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // No casts defined in Laravel model
      }
    );
  }

  static associate(models) {
    // Relationships
    this.belongsTo(models.City, { foreignKey: 'city_id', as: 'city' });
  }
}

// Initialize the model
CityTranslation.init();

module.exports = CityTranslation;