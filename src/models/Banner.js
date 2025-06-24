const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Banner extends Model {
  static init() {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        img: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        type: {
          type: DataTypes.STRING,
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
        clickable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        input: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        shop_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Banner',
        tableName: 'banners',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Replicate Laravel's guarded behavior: only 'id' is protected
        // Sequelize doesn't have direct "guarded" equivalent, but all fields except 'id' are mass-assignable
        // Casts: 'active' and 'clickable' are already BOOLEAN, no additional casting needed
      }
    );
  }

  // Constants
  static BANNER = 'banner';
  static LOOK = 'look';

  static TYPES = [
    this.BANNER,
    this.LOOK,
  ];

  // Traits (to be implemented separately as needed)
  // Loadable: Custom trait for loading-related functionality
  // Likable: Custom trait for liking-related functionality
  // Note: These traits are not implemented here as per "no additions" instruction
  // Implement these as separate utilities or include in a base class if needed

  static associate(models) {
    // Relationships
    this.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
    this.belongsToMany(models.Product, {
      through: models.BannerProduct,
      foreignKey: 'banner_id',
      as: 'products',
    });
    this.hasMany(models.BannerTranslation, { foreignKey: 'banner_id', as: 'translations' });
    this.hasOne(models.BannerTranslation, { foreignKey: 'banner_id', as: 'translation' });
  }
}

// Initialize the model
Banner.init();

module.exports = Banner;