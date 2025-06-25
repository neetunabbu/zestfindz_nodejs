const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Banner extends Model {}

// ✅ Model Definition
Banner.init(
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
  }
);

// ✅ Constants
Banner.BANNER = 'banner';
Banner.LOOK = 'look';

Banner.TYPES = [
  Banner.BANNER,
  Banner.LOOK,
];

// ✅ Associations
Banner.associate = (models) => {
  Banner.belongsTo(models.Shop, { foreignKey: 'shop_id', as: 'shop' });
  Banner.belongsToMany(models.Product, {
    through: models.BannerProduct,
    foreignKey: 'banner_id',
    as: 'products',
  });
  Banner.hasMany(models.BannerTranslation, { foreignKey: 'banner_id', as: 'translations' });
  Banner.hasOne(models.BannerTranslation, { foreignKey: 'banner_id', as: 'translation' });
};

module.exports = Banner;
