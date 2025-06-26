const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // PostgreSQL connection

class Banner extends Model {}

Banner.init(
  {
    id: {
      type: DataTypes.BIGINT,  // 🔄 Match BIGSERIAL
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'banner',  // ✅ Match DB default
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,  // ✅ Match DB default
    },
    clickable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,  // ✅ Match DB default
    },
    input: {
      type: DataTypes.INTEGER,
      allowNull: true,  // ✅ No NOT NULL constraint in DB
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: true,  // ✅ No NOT NULL constraint in DB
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
