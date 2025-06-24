const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class AdsPackageTranslation extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        ads_package_id: {
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
          allowNull: false,
        },
        button_text: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'AdsPackageTranslation',
        tableName: 'ads_package_translations',
        timestamps: false, // Match Laravel's $timestamps = false
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
      }
    );
  }

  static associate(models) {
    // Relationships
    this.belongsTo(models.AdsPackage, { foreignKey: 'ads_package_id', as: 'adsPackage' });
  }
}

// Initialize the model
AdsPackageTranslation.init();

module.exports = AdsPackageTranslation;